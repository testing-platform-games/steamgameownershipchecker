require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const axios = require('axios');
const cors = require('cors');

const app = express();

const { STEAM_API_KEY, BASE_URL } = process.env;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
  returnURL: `${BASE_URL}/auth/steam/return`,
  realm: BASE_URL,
  apiKey: STEAM_API_KEY
}, (identifier, profile, done) => {
  process.nextTick(() => {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

app.use(cors());
app.use(session({ secret: 'wolf3d_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('✅ Steam Ownership Check Server is Running'));

app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), async (req, res) => {
  const steamid = req.user.id;
  const targetAppId = parseInt(req.query.appid || "2270", 10);

  try {
    const { data } = await axios.get('https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/', {
      params: {
        key: STEAM_API_KEY,
        steamid,
        include_appinfo: false,
        include_played_free_games: true
      }
    });

    const owns = (data.response.games || []).some(g => g.appid === targetAppId);
    const redirectURL = `https://testing-platform-games.github.io/result.html?owned=${owns}&appid=${targetAppId}`;
    res.redirect(redirectURL);
  } catch (err) {
    res.redirect(`https://testing-platform-games.github.io/result.html?error=1`);
  }
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));

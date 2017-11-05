# notiscord
A proposal for a self-hosted Discord github notifier bot

## Usage instructions
0. Make sure you have nodejs and npm installed
1. Create a discord app and a bot for it
2. Store the appropriate configuration by copying the `config/default.yml` file to `config/local.yml`
3. Authorize your application bot to enter your server by visiting:
  ```
  https://discordapp.com/oauth2/authorize?&client_id=<CLIENT ID>&scope=bot&permissions=0
  ```
4. Point a github repository webhook to:
  ```
  http://your.example.com:3420/githook
  ```
5. Install dependencies with `npm install`
6. Run the bot with `node index.js`
7. [Set up an issue](https://github.com/kongr45gpen/notiscord/issues) if you have any issues!

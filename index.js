const Discord = require('discord.js');
const log = require('winston');
const config = require('config');
const http = require('http')
const githubhook = require('githubhook');

log.cli();
log.level = 'silly';
const client = new Discord.Client();

client.on('ready', () => {
  log.info('App ready');
});

client.on('message', message => {
  log.silly('Received message %s', message.content);

  if (message.content === 'ping') {
    message.reply('pong! Welcome to the **club**!');
  }
});

client.on('error', () => {
    log.error('Error');
});

client.on('debug', m => log.silly(m));

//client.on('error', m => console.log('debug', new Error(m).stack));
//client.on('reconnecting', m => console.log('reconnecting', m));

log.debug('Getting started...');
client.login(config.get('discord.bot-token'));

var github = githubhook({
    port: config.get('github.port'),
    secret: config.get('github.secret'),
    path: '/githook',
    logger: log
});

github.on('push', function (repo, ref, data) {
    var channel = client.channels.find('name', config.get('discord.channel'));

    if (!channel) {
        log.error('Channel %s not found', config.get('discord.channel'));
    } else {
//        channel.send('**' + data.commits.length + '**' + ' pushed to ' + '[' + repo + '](' + data.repository.url + ')' + ' by ' + '*[' + data.sender.login + '](' + data.sender.html_url + ')*');

        let max = 3;
        if (data.commits.length < max) max = data.commits.length
        var skipped = data.commits.length - max

        data.commits.slice(0,max).forEach(function(commit) {
            var message = commit.message.split('\n')[0];
            var extended = commit.message.split('\n').slice(1).join('\n');
            if (extended == '') extended = null;

            channel.send({embed: {
                color: 0x10BE86,
                author: {
                    name: commit.author.username,
                    icon_url: data.sender.avatar_url
                },
                title: message,
                description: extended,
                url: commit.url,
                fields: [{
                    name: "Branch",
                    value: data.ref.split('/',3)[2],
                    inline: true
                },{
                    name: "ID",
                    value: commit.id.slice(0,7),
                    inline: true
                }],
                timestamp: new Date(commit.timestamp),
                thumbnail: {
                    url: data.sender.avatar_url,
                },
                footer: {
                    icon_url: data.repository.owner.avatar_url,
                    text: data.repository.full_name
                }
            }});
        });
    }

    if (skipped > 0) {
      // Oh no! Messages skipped!
      channel.send(skipped + " messages skipped.")
    }
});

github.listen();
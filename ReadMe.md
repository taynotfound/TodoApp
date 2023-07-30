# Todo App

📝 A simple Todo App built with Node.js and Express.

## Setup Instructions

1. Install dependencies by running the following command:
```shell
npm install
```

2. Configure the config.json file
```json
{
    "clientid": "yourclientid",
    "clientsecret": "yourclientsecret",
    "callbackurl": "http://localhost:3000/auth/discord/callback",
    "secret": "SuperSecureSecret123",
    "port" : 3000,
    "alloweduser": "yourdiscordid"
}
```
Replace the placeholder values (yourclientid, yourclientsecret, yourdiscordid) with your actual values. Here's what each property represents:

- clientid: The client ID of your Discord application. You can obtain this by creating a new application in the Discord Developer Portal.
- clientsecret: The client secret of your Discord application. This is also obtained from the Discord Developer Portal.
- callbackurl: The URL where Discord will redirect the user after authentication. In this case, it should be http://localhost:3000/auth/discord/callback.
- secret: A secret key used for session encryption. You can choose any secure string for this.
- port: The port number on which the application will run. By default, it is set to 3000.
- alloweduser: The Discord ID of the user who is allowed to access the application. This is used for authorization purposes. You can obtain your Discord ID by enabling Developer Mode in Discord and right-clicking on your profile.

3. Start the application by running the following command:
```shell
node index.js
```


   The application will be accessible at `http://localhost:3000`.

## Description

The Todo App is a simple web application that allows you to manage your todos. You can add new todos, mark them as completed, and delete them. The app provides a clean and intuitive user interface to help you stay organized and keep track of your tasks.

Feel free to explore the app and start managing your todos efficiently!

🚀 Happy tasking! 📅✅
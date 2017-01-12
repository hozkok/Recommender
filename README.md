# Build Instructions

### Prerequisities
* [Install MongoDB](https://docs.mongodb.com/v3.0/administration/install-on-linux/)
  - After that, make sure mongodb is running when trying to run server
* [Install NodeJS version >= 6.0.0](https://nodejs.org/)
* Install Android Environment in order to build apps on Android devices
  - there is a guide about how to [set up android sdk for cordova](https://cordova.apache.org/docs/en/6.x/guide/platforms/android/)


### Install Dependencies

```sh
sudo npm install -g cordova ionic
```

Inside the `server-new` directory run;
```sh
npm install
```

to run the server run the following command in `server-new` directory;
```sh
node server.js
```

the `PORT` variable in which the server runs is written in `.env-variables` file.

Inside the `RecommenderApp` directory run;
```sh
npm install
ionic platform add android
```

After connecting your device, in the `RecommenderApp` directory run;
```sh
ionic run android
```

to build the app and generate `.apk` file;
```sh
ionic build android
```

and it will build the app, print the directory of the apk





## Recommender

#### Requirements
* nodejs
* mongodb
* cordova
* ionic

#### Usage
The UI of the app is completely different. here is how to use it;

- Login:
    * if you are already registered user, just type the phone number
      and press 'login'

    * if you are not a registered user, type User name and Phone number
      to register the new phone for the app.

    * if phonenum is already registered, you will encounter a duplicate
      key exception.

- My Topics
    * After log in, you will see the My Topics view.

    * If you don't have any topics, you will see an info to indicate that.

    * On the top-right corner, You will see a plus-icon to create new a
      new topic.

    * You can also Pull up the view to refresh all your topics with the
      most recent data.

    * On the top-left corner, you will see a menu-icon to toggle side-menu.
      You will see Responses, Share, Sync options there.

- New Topic
    * After logged in, you will see the My Topics view.

    * On the top-right, you will see a "plus" icon to create new topic.

    * in New Topic view, you will see a disabled "tick" icon on top-right
      corner. You need to fill all the required fields to be able to tap
      on it.

    * Required fields are: What, Where, Description and you need to select
      at least one participant from "Add Participants"

    * if you don't set Destruct Date, topic will not be destructed.

- Topic
    * after you select a Topic, you will be redirected to that topic's
      view.

    * in the responses section, You will see;
      <uname> (<share_degree>) : <response>

    * on the top-right corner, you will see an icon to add more
      participants to the topic.

    * You need to Scroll Pull Up to refresh the topic with the most
      recent data. (aka: Pull to Refresh)

- Responses
    * In the Responses view, you will need to pull up to get the response
      requests that are sent to you.

    * If there is no response request sent, you will see a message
      that indicates there are no response requests for you.

    * In a response, you will see what, where, description of the request.

    * You will see three icon buttons which are Respond, Share, Delete
      respectively.

    * Once you respond with a text, the topic owner will see your response
      as soon as refreshes the Topic page.

    * If you delete a response, Topic owner will see your action as
      "cancelled."

- Sync
    * sync option in the menu syncs all the data including the auto
      completion list, contacts who are using the app, response requests.

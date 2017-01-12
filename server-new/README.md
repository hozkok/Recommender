# Server Instructions

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

Inside the `RecommenderApp` directory run;
```sh
npm install
ionic platform add android
```

# The Movie Monster

The Movie Monster is a movie trivia game offering multiple game modes to users wishing to play a movie quiz game. The modes include various prompts, like still frames from movies and tv shows, images of actors and trailer snippets. Additionally, the user can either create a custom game or choose from two preset game modes. The game is able to be played in multiplayer or alone and offers ranked leaderboards.

## Technologies used  

Written in JavaScript, using React.
  
Built with:  
- [React](https://react.dev/)
- [Axios](https://axios-http.com/)
- [MUI](https://mui.com/)
- [STOMP](https://stomp-js.github.io/stomp-websocket/)
- [SockJS](https://github.com/sockjs/sockjs-client)
- [react-youtube](https://www.npmjs.com/package/react-youtube)
- [ReduxJS](https://redux.js.org/)




## High-level components

- Main page component: [Main](src/components/views/other/Main.js). This component allows the user to navigate to all other component views, such as the leaderboard, their profile, game creation, join game page and so on.
- Game selection and Game page: [GameSelection](src/components/views/game/GameSelection.js), [Game](src/components/views/game/Game.js). These two components are there to create a game and start it. It lets players choose parameters such as the number and type of questions. The Game view is a waiting room, where the host can wait for other players to join or start the game. 
- Question pages: [Question](src/components/views/game/Question.js), [RapidQuestion](src/components/views/game/RapidQuestion.js). These views form the main game loop. They serve questions to the players and handles the answering.
- Standing and Winner pages: [Standings](src/components/views/game/Standings.js), [Winner](src/components/views/game/Winner.js). The Standings page shows the rankings of users after every question of a multiplayer match. The winner page is responsible for showing who won the game and routing people back to the main page.

## Launch & Deployment
  
To build and run the project locally within your IDE (we recommend IntelliJ IDEA), import the project, then follow these steps using [npm](https://www.npmjs.com/):

```bash
# installing dependencies:
npm install

# local development build:
npm run dev

# production build:
npm run build
```
    
Deployment uses GitHub workflows to deploy the project to google cloud. See `main.yaml`. Set up your google cloud project and create a service account with the editor role, download the keys and use github's secret manager to manage them. When done correctly, the code should be automatically deployed when pushing or merging with the main branch.

## Roadmap

Future features to implement include a centrally synchronized question timer, more game modes, including different ways to answer (like a text box, instead of predetermined buttons), a friend's list and more.
  

## Authors & Acknowledgement  

### Authors  
- [Natalia Shakirova](https://github.com/orgs/sopra-fs23-group-39/people/NattiShakira)
- [Yannick Salzmann](https://github.com/orgs/sopra-fs23-group-39/people/yasalz)
- [Damjan Kuzmanovic](https://github.com/orgs/sopra-fs23-group-39/people/dkuzma1)
- [Florence Hügi](https://github.com/orgs/sopra-fs23-group-39/people/florencehuegi)
- [Markus Niemack](https://github.com/orgs/sopra-fs23-group-39/people/NieMark)  
Additionally, we would like to thank our teaching assistants [Sheena Lang](https://github.com/SheenaGit) and [Roy Rutishauser](https://github.com/royru) for helping with this project.

## License

[GNU GPLv3]([https://choosealicense.com/licenses/mit/](https://choosealicense.com/licenses/gpl-3.0/))

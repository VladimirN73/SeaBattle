# Tech Info

Repo    : Github https://github.com/VladimirN73/SeaBattle.git
Style   : SCSS, Booststrap
Hosting : AWS
Database: Firestore Database (Google Firebase), https://console.firebase.google.com/u/0/project/sea-battle-a78c4/settings/general/

# Issues

# Todo

## Info
1. supported typescript version by angular - see here (take/use the correct branch)
   * https://github.com/angular/angular/blob/master/package.json

# History (newest on top)
11.07.21
firestore works

04.07.21
ng g c debug/debugFirestore 

copy config from sea-battle-app (from firebase-console in prev step) into environment 
create/register sea-battle-app in firebase-console https://console.firebase.google.com/u/0/project/sea-battle-a78c4/settings/general/

npm i @angular/fire
npm i firebase

29.06.21
ng update @angular/cli @angular/core  --allowDirty=true --force

28.06.21
add folders seabattle and debug

20.06.21
ng update @types/node                 --allowDirty=true --force
ng update @angular/cli @angular/core  --allowDirty=true --force


pwa still not working on AWS
In AWS Amplify adapt the rewrite rule : add extension 'manifest' to the available rule
pwa works on Azure but does not work on AWS Amplify

ng build --configuration=production

15.06.21

do not forget that PWA works only for HTTPS

install popup is not shown ...

ok, build and deploy is working

npm i rxjs@6.5.3 --allowDirty=true --force
npm view rxjs versions     --- review versions
ng add @angular/pwa        --- error incompatible with rxjs 7.1.0, expected is rxjs@^6.5.3

14.06.21
npm i --save-dev @types/lodash
npm i lodash
ng update rxjs        --allowDirty=true --force
ng update tslib       --allowDirty=true --force
ng update @types/node --allowDirty=true --force

11.06.21

npm i bootstrap

npm i

created with command 

ng new SeaBattle ^
--skip-tests ^
--minimal=true ^
--style=scss ^
--routing=true ^
--skip-install=true ^
--commit=false ^
--skip-git=false ^
--strict=true

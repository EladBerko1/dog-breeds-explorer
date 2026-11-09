// גזע כלבים כפי שהאפליקציה משתמשת בו.
// id = שם הגזע כפי שמופיע ב-API (למשל "hound"), ומשמש גם בכתובת /breeds/hound
export interface Breed {
  id: string
  name: string
  subBreeds: string[]
}

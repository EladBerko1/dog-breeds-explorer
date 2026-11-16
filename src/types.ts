// גזע כלבים כפי שהאפליקציה משתמשת בו.
// id = שם הגזע כפי שמופיע ב-API (למשל "hound"), ומשמש גם בכתובת /breeds/hound
export interface Breed {
  id: string
  name: string
  subBreeds: string[]
}

// התשובה של Dog CEO לכתובת /breeds/list/all
// message הוא אובייקט: שם הגזע → מערך תתי-הגזעים, למשל { "hound": ["afghan", "basset"] }
export interface BreedsApiResponse {
  message: Record<string, string[]>
  status: string
}

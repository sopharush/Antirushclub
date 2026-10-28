// Any "Pull Up a Chair" button opens the club signup modal through this event.
export const OPEN_CLUB_SIGNUP = 'arc:open-club-signup'

export const openClubSignup = () => window.dispatchEvent(new Event(OPEN_CLUB_SIGNUP))

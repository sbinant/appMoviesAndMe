const initialeState = { favoritesFilm: [] }

function toggleFavorite(state = initialeState, action) {

    let nextState
    switch (action.type) {
        case 'TOGGLE_FAVORITE':

            const favoriteFilmIndex = state.favoritesFilm.findIndex(item => item.id === action.value.id)
           
            if(favoriteFilmIndex !== -1) {    
                nextState = {
                    ...state,
                    favoritesFilm: state.favoritesFilm.filter( (item, index) => index !== favoriteFilmIndex) 
                }
            }
            else { 
                //ajouter
                nextState = {
                    ...state, 
                    favoritesFilm: [...state.favoritesFilm, action.value]
                } 
            }
            return nextState || state
        default:
            return state;
    }
}
export default toggleFavorite
import React from 'react'
import { StyleSheet, View, Share, Platform, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component {

  //bouton partage
  static navigationOptions = ({ navigation }) => { // ()
    const { params } = navigation.state
   
    if (params.film != undefined && Platform.OS === 'ios') {
      return {
          
          headerRight: (

            <TouchableOpacity
              style={styles.share_touchable_headerrightbutton}
              onPress={ () => params.shareFilm() }>
                  <Image
                    style={styles.share_image}
                    source={require('../Images/ic_share.png')} />
            </TouchableOpacity>
          )
      }
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      film: undefined,
      //dps data si fetch: on recup elts depuis this.state.film.xxx (film = { data } )
      isLoading: true
    }
  
    this._toggleFavorite = this._toggleFavorite.bind(this)
    this._shareFilm = this._shareFilm.bind(this)
   
  }

  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film: this.state.film
    })
  }
  
  _toggleFavorite() {
    const action = { 
      type: "TOGGLE_FAVORITE",
      value: this.state.film
    }
    this.props.dispatch(action)
  }

  _shareFilm() {
    const { film }  = this.state
    
    Share.share({ title: film.title, message: film.overview })
  }

  _displayFloatingActionButton() { //creation special Android button
    const { film } = this.state 
    if( film != undefined && Platform.OS === 'android' ) {

      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={ () => this._shareFilm() } >
          <Image
            style={styles.share_image}
            source={require('../Images/ic_share.png')} />
        </TouchableOpacity>
      )
    }
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
          <View style={styles.loading_container}>
            <ActivityIndicator size="large" color="#333" />
          </View>
      )
    }
  }

  _displayFavoriteImage() { // (3)
    var sourceImage = require('../Images/ic_favorite_border.png')
    var shouldEnlarge = false

    if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1)
    {
      sourceImage = require('../Images/ic_favorite.png')
      shouldEnlarge = true
    }
    return (
      <EnlargeShrink shouldEnlarge={shouldEnlarge} > 
        <Image style={styles.favorite_image} source={sourceImage} />
      </EnlargeShrink>
    )
  }

  _displayFilm() {
    const { film } = this.state
    if (film != undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
          <Image
              style={styles.image}
              source={ { uri: getImageFromApi(film.backdrop_path)} }/>
            <Text style={styles.film_title}>{film.title}</Text>
          
            <TouchableOpacity
              style={styles.favorite_container}
              onPress={ () => this._toggleFavorite() }>
             { this._displayFavoriteImage() }
            </TouchableOpacity>

            <Text style={styles.film_description}>{film.overview}</Text>
            <View style={styles.film_detail}>
              <Text>Sorti le : {moment(film.release_date).format('DD/MM/YYYY')} </Text>
              <Text>Note : {film.vote_average} </Text>
              <Text>Nombre de notes : {film.vote_count} </Text>
              <Text>Budget : {numeral(film.budget).format('0,0[.]00 $')} </Text>
              <Text>Genre(s) : {film.genres.map( (genre)  => { return genre.name}).join(" - ")} </Text>
              <Text>Prod : {film.production_companies.map( (prod) => { return prod.name }).join(" - ")} </Text>
            </View>
        </ScrollView>
      )     
    }
  }

  componentDidMount() { // se déclenche à la fin = cf life cycle component
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm) //!param ou params?
    
    if (favoriteFilmIndex !== -1)
    { 
      this.setState({
        film: this.props.favoritesFilm[favoriteFilmIndex]
        }, () => { this._updateNavigationParams() })

      return
    }

    this.setState( { isLoading: true } )
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      }, () => { this._updateNavigationParams() })
    })
  }
    render() {
     return (
            <View style={styles.main_container}>
                { this._displayLoading() }
                { this._displayFilm() }
                { this._displayFloatingActionButton( ) }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
       },
    scrollview_container: {
        flex: 1,
        backgroundColor: '#e9e9ee'
    },
    image: {
        height: 170,
        marginTop: 5,
        backgroundColor: 'gray'
      },
    film_title: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center'
    },
    film_detail: {
      marginTop: 15,
    },
    favorite_container: {
      alignItems: 'center', //alignement des components enfants sur l'axe secondaire, x ici
    },
    favorite_image: {
      flex: 1,
      width: null, 
      height: null
    },
    share_touchable_floatingactionbutton: {
      position: 'absolute',
      width: 60,
      height: 60,
      right: 30,
      bottom: 30,
      borderRadius: 30,
      backgroundColor: '#e91e63',
      justifyContent: 'center',
      alignItems: 'center'
    },
    share_image: {
      width: 30,
      height: 30
    },
    share_touchable_headerrightbutton: {
      marginRight: 8
    } 
})

//redux
const mapStateToProps = (state) => {

  return {
    favoritesFilm: state.toggleFavorite.favoritesFilm
  }
}
export default connect(mapStateToProps)(FilmDetail)
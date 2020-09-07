import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native'
import { getImageFromApi } from '../API/TMDBApi'
import FadeIn from '../Animations/FadeIn';

  class FilmItem extends React.Component {


    _displayFavoriteImage() {
      if(this.props.isFilmFavorite) {
        return (
          <Image
            style={styles.favorite_image}
            source={require('../Images/ic_favorite.png')}
          />
        )
      }
    }
    
    render() {

      const { film, displayDetailForFilm } = this.props

      return (

        <FadeIn>
          <TouchableOpacity
            style={styles.main_container}
            onPress={ () => displayDetailForFilm(film.id) }>

            <Image style={styles.image} source={ { uri: getImageFromApi(film.poster_path) } } />
            <View style={styles.content_container}>

              <View style={styles.header_container}>
            
              {this._displayFavoriteImage()}

                <Text style={styles.title_text}>{film.title}</Text>
                <Text style={styles.vote_text}>{film.vote_average}</Text>
              </View>

              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>{film.overview}</Text>
              </View>
              <View style={styles.date_container}>
                <Text style={styles.date_text}>Sorti le {film.release_date}</Text>
              </View>
          </View>
        </TouchableOpacity>
      </FadeIn>

      )
    }
  }

const styles = StyleSheet.create({

main_container: {
  height: 190,
  flexDirection: 'row'
},
image: {
  width: 120,
  height: 180,
  margin: 5,
  backgroundColor: 'gray'
},
content_container: {
  flex: 1,
  margin: 5
},
header_container: {
  flex: 3,
  flexDirection: 'row'
},
title_text: {
  fontWeight: 'bold',
  fontSize: 20,
  flex: 1,
  flexWrap: 'wrap',
  paddingRight: 5
},
vote_text: {
  fontWeight: 'bold',
  fontSize: 26,
  color: '#666666'
},
description_container: {
  flex: 7
},
description_text: {
  fontStyle: 'italic',
  color: '#666666'
},
date_container: {
  flex: 1
},
date_text: {
  textAlign: 'right',
  fontSize: 14
},
favorite_image: {
  width: 25,
  height: 25,
  marginRight: 5
}
})
export default FilmItem

/**
TouchableOpacity
----------------
Un TouchableOpacity n'est en soi qu'une "enveloppe" permettant à vos vues d'être cliquables. Vous verrez,on en utilise beaucoup. View = pas clickable

Fonctionnalité: ajout d'un coeur si film en fav
-----------------------------------------------

Vous avez ici deux solutions pour réaliser cette fonctionnalité.

La première consiste à connecter le store Redux au component FilmItem ; c’est la solution la plus simple, mais pas la plus optimisée. Avec cette solution, vous allez connecter le store Redux autant de fois qu’il y a de components FilmItem. Autrement dit, si vous affichez 100 films, vous allez connecter 100 fois le store Redux, ce n’est pas terrible.

La deuxième solution, plus propre, mais plus complexe, consiste à connecter le store Redux une seule fois dans le component Search, puis de faire passer à nos components FilmItem une prop  isFilmFavorite  (qui vaut  true  ou  false  ) qui affichera, ou non, le 🖤dans nos items.

Il n’y a rien de si compliqué là-dedans ? Il est où, le piège ? 🧐

Le piège, ce sont les listes de données sur React Native, les FlatList. Les listes de données sont pensées pour afficher énormément de données, des centaines d’items, voire des milliers. De ce fait, elles se doivent d’être optimisées au maximum, sans quoi notre application en serait ralentie.

Parmi les optimisations qu’elles possèdent, il y en a une qui peut se traduire par :

Moi, FlatList, je ne me re-rend que si l’on me le demande ET si mes données ont changé.

Vous voyez où je veux en venir ? Revenons à notre application et à la fonctionnalité que l’on souhaite mettre en place ici, ce sera plus simple. ;)

Actuellement, notre liste de données, notre FlatList, affiche une liste de films  this.state.films  . Lorsque vous aurez connecté le store Redux au component Search, vous aurez accès aux films favoris  this.props.favoritesFilm  .

Imaginons maintenant que vous ajoutiez un film aux favoris ; vous êtes d’accord avec moi pour dire que la liste des films favoris  this.props.favoritesFilm  va changer. Mais qu’en est-il de notre liste de films  this.state.films  ? Elle, elle ne change pas. Nous n’avons pas récupéré de nouveaux films de l’API au moment d’ajouter un film à nos favoris.

Du coup, lorsque vous allez ajouter un film aux favoris, le component Search va entrer dans le cycle de vie updating. Il va appeler son  render  , demander à notre FlatList de se re-rendre, mais cette dernière va répondre :

Oui, j’ai bien compris que l’on me demande de me re-rendre, MAIS mes données n’ont pas changé, donc je reste comme je suis et je ne me re-rends pas.

Ce qui, au niveau de notre application, fera que l’on ne re-rend jamais les items de notre FlatList (FilmItem) et donc que l’on n’affiche jamais l’image des favoris 🖤à côté du titre du film.

Donc la deuxième solution ne marche pas ? On repart sur la première solution ?

Attendez, attendez ! Je n’ai pas terminé. :D React Native propose une solution à notre problème. Cette solution, c’est la prop extraData d’une FlatList. Elle permet de dire à notre FlatList de se re-rendre si ses données et d’autres données (ajoutées dans extraData) ont changé.

Ici, lorsque vous aurez connecté le store Redux au component Search, vous pourrez ajouter la prop extraData sur la FlatList :

extraData={this.props.favoritesFilm}
Cela devrait beaucoup mieux fonctionner. ;)

Ce comportement est dû au fait que les FlatList sur React Native sont des PureComponent. Si ce côté technique et avancé de React Native vous intéresse, vous trouverez plus d’informations sur la documentation React des PureComponent.

Je ferme cette longue parenthèse sur le comportement des FlatList et vous laisse travailler. :p

Normalement, hormis la prop  extraData  , il n'y a pas de piège. Essayez de réaliser cette fonctionnalité par vous-même, cela vous permettra de manipuler Redux et son fonctionnement. Pour information, ici, pas de besoin de toucher au reducer ni au store, on a déjà tout ce qu'il nous faut pour faire cette fonctionnalité.

 */
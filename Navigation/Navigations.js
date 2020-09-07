// stack Nav
import React from 'react'
import {StyleSheet, Image} from 'react-native'
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'
import Search from '../Components/Search'
import FilmDetail from '../Components/FilmDetail'
import Favorites from '../Components/Favorites'


const SearchStackNavigator = createStackNavigator({
    Search: { 
        screen: Search, 
        navigationOptions: {
            title: "Rechercher"
        }
    },
    FilmDetail: {
        screen: FilmDetail
    }
})

const FavoritesStackNavigator = createStackNavigator({
    Favorites: {
        screen: Favorites,
        navigationOptions: {
            title: "Favoris"
        }
    },
    FilmDetail: {
        screen: FilmDetail
    }
})

const MoviesTabNavigator = createBottomTabNavigator(
    {
        Search: {
            screen: SearchStackNavigator,
            navigationOptions: {
                tabBarIcon: () => {
                    return <Image source={require('../Images/ic_search.png')} style={styles.icon}/>
                }
            }
        },
        Favorites : {
            screen : FavoritesStackNavigator,
            navigationOptions: {
                tabBarIcon: () => {
                    return <Image source={require('../Images/ic_favorite.png')} style={styles.icon}/>
                }
            }
        }
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#DDDDDDDD',
            inactiveBackgroundColor: '#fff',
            showLabel: false,
            showIcon: true
        }
    }
)

export default createAppContainer(MoviesTabNavigator)

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    }
})
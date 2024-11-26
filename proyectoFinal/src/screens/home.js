import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, db } from "../firebase/config";
import PostCard from '../components/postCard';

class Home extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
        };
    }

    compnentDidMount() {
      auth.onAuthStateChanged(user => {
        if (!user) {
          this.props.navigation.navigate("Login");
        } else {
          db.collection("users").where("email", "==", auth.currentUser.email).onSnapshot(snap => {
            if(!snap.empty) {
              const data = snap.docs[0];
              this.setState({ user: data.data().user });
            }
          })
        }
      })
      this.fetchPosts();
    }

    fetchPosts = () => {
      db.collection("posts").orderBy("createdAt").onSnapshot(query => {
        const posts = query.docs.map(data => ({
          id: data.id,
          data: data.data()
        }))
        this.setState({posts: posts})
      }).catch(e => console.log(e))
    }

    logout() {
      auth
        .signOut()
        .then(() => {
          this.props.navigation.navigate("Login");
        })
        .catch((error) => console.log(error));
    }


    render() {
      if (this.state.posts.length === 0) {
        return (
            <View>
                <Text>¡Bienvenido!</Text>
                <Text>No hay novedades</Text>
            </View>
        );
    } else {
        return (
            <View>
                <Text>¡Bienvenido!</Text>
                <Text>Novedades</Text>
                <PostCard />
            </View>
        );
    }
    }
  }

export default Home;
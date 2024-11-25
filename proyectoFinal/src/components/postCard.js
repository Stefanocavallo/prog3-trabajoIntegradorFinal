import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from "../firebase/config";


class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
  }

  componentDidMount() {
    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(docs => {
        let arrayPosts = [];
        docs.forEach(doc => {
          arrayPosts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState({ posts: arrayPosts, loading: false });
      });
  }

  render() {
    const { posts, loading } = this.state;

    return (
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View>
                <Text>{item.data.email}</Text>
                <Text>{item.data.posteo}</Text>
                aca pegar
              </View>
            )}
          />
        )}
      </View>
    );
  }
}


export default Posts;
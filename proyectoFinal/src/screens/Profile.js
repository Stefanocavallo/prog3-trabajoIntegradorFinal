import React,{Component} from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedbackBase}  from "react-native";
import firebase from "firebase";
import {auth, db} from "../firebase/config";
import "firebase/firestore";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailUser: '',
            userName: '',
            userPosts: [],
        };
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('logeado okay');
                console.log(auth.currentUser);
                this.setState({profiles: auth.currentUser});
                const mailUser = auth.currentUser.email;
                db.collection('users').onSnapshot(
                    docs => {
                        docs.forEach(
                            doc => {
                                console.log(doc.data().owner);
                                console.log(mailUser);
                                console.log(doc);
                                
                                if (doc.data().owner === mailUser) {
                                    console.log(doc.data().owner);
                                    console.log(doc.data().createdAt);
                                    console.log(doc.data().username);
                                    this.setState({
                                        profileEmail: doc.data().owner,
                                        profileCreationTime: doc.data().createdAt,
                                        profileUsername: doc.data().username,
                                    });
                                }
                                else {
                                    console.log('error');
                                }
                            }
                        );
                    }
                )
                db.collection('posts').where('email' , '==', mailUser).onSnapshot(
                    docs => {
                        let posts = [];
                        docs.forEach(doc => {
                            posts.push({
                                id: doc.id,
                                data: doc.data()
                            });
                        });
                        this.setState({
                            postsUser: posts,
                            loading: false
                        });
                    },
                    error => {
                        console.error(error);
                        this.setState({loading: false});
                    }
                );
            } else {
                console.log('chau logeado');
            }
        });
    }
    eliminarPost = (idPost) => {
        db.collection("posts")
        .doc(idPost)
        .delete()
        .then(() => {
            console.log("Post eliminado");
        })
        .catch((error) => {
            console.log(error);
        })
    }
}

export default Profile
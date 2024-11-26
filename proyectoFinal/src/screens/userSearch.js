import {Text,View, TextInput, FlatList, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import {auth,db} from '../firebase/config';

export default class userSearch extends Component {
    constructor(props){
        super(props)
        this.state = {
            search: '',
            usuarios: [],
        }
    }

    componentDidMount() {
        db.collection('users').onSnapshot(docs => {
            let users = [];

            docs.forEach(doc => {
                users.push({
                    id: doc.id,
                    data: doc.data()
                });
            });

            this.setState({
                usuarios: users,
            });
        });
    }

    tipear(input){
        this.setState({
            search: input
        })
    }

    render(){
        const {usuarios, search} = this.state;

        const filtrarUsers = usuarios.filter(user =>user.data.username.toLowerCase().includes(search.toLowerCase()));
        
        return (

        <View style={styles.container}>

            <Text style={styles.title}>Busca a un usuario</Text>
            
            <TextInput
                style = {styles.input}
                placeholder = "Ingrese el nombre de usuario a buscar"
                keyboardType='default'
                onChangeText = {event => this.tipear(event)}
                value = {search}
            />
            {
                search !== ''
                &&
                <FlatList
                data={filtrarUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.user}>{item.data.username}</Text>
                )}
            />
            }
             
        </View>
    )}
}
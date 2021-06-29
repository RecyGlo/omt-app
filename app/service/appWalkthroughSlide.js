export default slides = [
    {
        key: 'k1',
        title: 'Welcome to Oh My Trash',
        text: 'Oh My Trash is a personal waste management app & waste trading matching platform.',
        image: {
            uri: 'https://oh-my-trash.s3-ap-southeast-1.amazonaws.com/oh_my_trash.png'
        },
        titleStyle: styles.title,
        textStyle: styles.text,
        imageStyle: styles.image,
        backgroundColor: '#f09839',
    },
    {
        key: 'k2',
        title: 'Recyclable Item',
        text: 'Information for recyclable items along with price.',
        image: {
            uri:
                'https://image.flaticon.com/icons/png/512/49/49793.png',
        },
        titleStyle: styles.title,
        textStyle: styles.text,
        imageStyle: styles.image,
        backgroundColor: '#F4B1BA',
    },
    {
        key: 'k3',
        title: 'Nearest Junk Shop ',
        text: 'Multiple near junk shop locations to sell recyclable items.',
        image: {
            uri: 'https://i.imgur.com/bXgn893.png',
        },
        titleStyle: styles.title,
        textStyle: styles.text,
        imageStyle: styles.image,
        backgroundColor: '#4093D2',
    },
    {
        key: 'k4',
        title: 'News',
        text: 'News covering all the benefits and advantages of recycling,the human actions that cause our planet harmful and tips to upcycle our used appliances and many more.',
        image: {
            uri: 'https://image.flaticon.com/icons/png/512/21/21601.png',
        },
        titleStyle: styles.title,
        textStyle: styles.text,
        imageStyle: styles.image,
        backgroundColor: '#644EE2',
    }
];

let styles = {
    container: {
        flex: 1,
        backgroundColor: '#f09839',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textc: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 20
    },
    progress: {
        backgroundColor: '#e5e5e5'
    },
    MainContainer: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 25,
        color: '#222',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    text: {
        color: '#222',
        fontSize: 20,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    }
};
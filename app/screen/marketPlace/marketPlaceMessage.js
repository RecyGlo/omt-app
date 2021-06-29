import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MarketPlaceOrderedAcceptedList from './marketPlaceOrderedAcceptedList';
import MyMarketPlaceOrderedAcceptedList from './myMarketPlaceOrderedAcceptedList';

class MarketPlaceMessage extends React.PureComponent {


    constructor(props) {
        super(props);
    }


    render() {

        return (

            <ScrollableTabView
                // ref="scrollTabView"
                initialPage={0}
                tabBarBackgroundColor='#f09839'
                tabBarActiveTextColor='#222'
                tabBarInactiveTextColor='#ffffff'
                tabBarTextStyle={{ fontSize: 16 }}
                tabBarUnderlineStyle={{ backgroundColor: '#fff' }}
            >
                <MarketPlaceOrderedAcceptedList
                    // ref="Buy"
                    tabLabel='Buy'
                    {...this.props}
                />
                <MyMarketPlaceOrderedAcceptedList
                    // ref="Sell"
                    tabLabel='Sell'
                    {...this.props}
                />
            </ScrollableTabView>
        )
    }
}

export default connect(null)(MarketPlaceMessage);

let styles = StyleSheet.create(
    {
        root: {
            backgroundColor: '#191e1f'
        },
        title: {
            marginBottom: 5,
            color: '#ECC951'
        },
        MainContainer: {
            justifyContent: 'center',
            flex: 1,
            paddingTop: 30,
        },
        imageThumbnail: {
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
        },

    }
);
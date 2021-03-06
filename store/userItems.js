import axios from "axios";
const HOST = "https://server-rstrm.herokuapp.com";
// const HOST = "http://localhost:8080";

//NO LONGER IN USE

/**
 * ACTION TYPES ------------------------------------------------
 */
const LOAD_ITEMS_ALL = "LOAD_ITEMS_ALL";
const ADD_ITEM_REVIEW = 'ADD_ITEM_REVIEW'
const ADD_ITEM_CHECKIN = 'ADD_ITEM_CHECKIN'

/**
 * INITIAL STATE --------------------------------------------------
 */
const initialState = {
    userBadges: [],
    userCheckins: [],
    userReviews: []
};

/**
 * ACTION CREATORS
 */
const _loadItemsAll = (userItems) => ({ type: LOAD_ITEMS_ALL, userItems });
const _addItemReview = (review) => ({ type: ADD_ITEM_REVIEW, review })
const _addItemCheckin = (review) => ({ type: ADD_ITEM_REVIEW, review })

/**
 * THUNK CREATORS -------------------------------------------------
 */
// UPDATE WITH OUR API

const loadItemsAll = (userId) => {
    //console.log('in thunk - ', userId)
    return async (dispatch) => {
        const response = (
            await axios.get(
                `${HOST}/api/users/${userId}/all`
            )
        ).data
        //console.log('in thunk', response)
        return dispatch(_loadItemsAll(response));
    };
};

/**
 * REDUCER -------------------------------------------------------
 */
const userItems = function (state = initialState, action) {
    switch (action.type) {
        case LOAD_ITEMS_ALL:
            //console.log('in reducer - LOAD_ITEMS_ALL')
            return action.userItems;
        case ADD_ITEM_REVIEW:
            //console.log('in reducer - ADD_ITEM_REVIEW')
            return { ...state, UserReviews: [action.review, ...state.userReviews] }
        case ADD_ITEM_CHECKIN:
           // console.log('in reducer - ADD_ITEM_CHECKIN')
            return { ...state, userCheckins: [action.checkin, ...state.userCheckins] }
        default:
            return state;
    }
};

export { userItems, loadItemsAll, _addItemReview, _addItemCheckin };

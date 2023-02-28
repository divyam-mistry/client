import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    post: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            // state -> current state
            state.mode = (state.mode === "light") ? "dark" : "light";
        },
        setLogin: (state, action) => {
            // state -> current state, action -> payload/params/arguments passed along
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if(state.user){
                state.user.friends = action.payload.friends;
            } else {
                console.log('user friends dont exist.');
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                // if post to be updated, return updated post 
                // (i.e the one coming from action)
                if(post._id === action.payload.post_id){
                    return action.payload.post;
                }
                // else return post
                return post;
            });
            state.post = updatedPosts;
        }
    }
});

export const {setFriends, setLogin, setLogout, setMode, setPost, setPosts} = authSlice.actions;
export default authSlice.reducer;
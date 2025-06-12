import React, { createContext, useReducer } from "react";

const initialState = {
  questions: [],
  thoughts: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, ...action.payload };

    case "LIKE_POST":
      return {
        ...state,
        [action.payload.category]: state[action.payload.category].map((post) =>
          post.id === action.payload.id ? { ...post, likes: post.likes + 1 } : post
        ),
      };

    case "ADD_COMMENT":
      return {
        ...state,
        [action.payload.category]: state[action.payload.category].map((post) =>
          post.id === action.payload.id
            ? { ...post, comments: [...post.comments, action.payload.comment] }
            : post
        ),
      };

    default:
      return state;
  }
};

const ForumContext = createContext(null);

const ForumProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <ForumContext.Provider value={{ state, dispatch }}>{children}</ForumContext.Provider>;
};

export { ForumContext, ForumProvider };

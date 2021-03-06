Meteor.methods({

  'createNewPost': function(postTitle, postText, startLang, isPrivate){
    var currentUser = Meteor.userId();
    check(postTitle, String);
    check(postText, String);

    if(postTitle == ""){
      postTitle = "Add a Title";
    }
    var data = {
      title: postTitle,
      text: postText,
      wordCount: getWordCount(postText),
      page: 1,
      createdBy: currentUser,
      language: startLang,
      createdAt: new Date(),
      privacy: isPrivate
    }
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You aren't logged in");
    }
    return Posts.insert(data);
  },

  'updatePost': function(postId, postTitle, postText, startLang, isPrivate){
    var currentUser = Meteor.userId();
    var data = {
      _id: postId,
      createdBy: currentUser
    }
    return Posts.update(data, {$set: 
      {
        title: postTitle,
        text: postText,
        wordCount: getWordCount(postText),
        language: startLang,
        privacy: isPrivate
      }
    });
  },

  // Updated stored page count
  'updatePostPage': function(postId, page){
    var currentUser = Meteor.userId();
    var data = {
      _id: postId,
      createdBy: currentUser
    }
    // Update count 
    return Posts.update(data, {$set:
      {
        page: page
      }
    });
  },

  'deletePost': function(postId){
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    var data = {
      _id: postId,
      createdBy: currentUser
    }
    Posts.remove(data);
  },

  // Reading lists

  'createNewReadingList': function(postId, endLang){
    var currentUser = Meteor.userId();

    var data = {
      post: postId,
      page: 1,
      createdBy: currentUser,
      language: endLang,
      updatedAt: new Date()
    }
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You aren't logged in");
    }
    return Readinglists.insert(data);
  },

  'updateReadingList': function(postId){
    var data = {
      post: postId,
      createdBy: Meteor.userId()
    }
    return Readinglists.update(data, {$set: 
      {
        updatedAt: new Date()
      }
    });
  },

  'updateReadingListLang': function(postId, endLang){
    var data = {
      post: postId,
      createdBy: Meteor.userId()
    }
    return Readinglists.update(data, {$set: 
      {
        language: endLang
      }
    });
  },

  'deleteReadingForPost': function(postId){
    var data = {
      post: postId
    }
    return Readinglists.remove(data);
  }

});


// Get word count
function getWordCount(text){
  text_array = text.split(" ");
  return text_array.length;
}
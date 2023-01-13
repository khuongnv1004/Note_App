import fakeData from "../../../fakeData/index.js";
import { FolderModel } from "../models/index.js";

export const resolvers = {
    Query: {
      folders: async (parent, args, context) => {
          const folders =  await FolderModel.find({authorId: context.uid})
        return folders ;
      },
      folder: async (parent, args)=>{
        const folderId = args.folderId;
        const folders =  await FolderModel.findOne({
            _id:folderId
        })
        return folders;
      },
      note: (parent, args)=>{
        const noteId = args.noteId;
        return fakeData.notes.find(note => note.id === noteId)
      }
    },
  
    Folder: {
      author: (parent, args) => {
          console.log({parent,args})
          const authorId = parent.authorId;
        return fakeData.author.find(author => author.id === authorId);
      },
      notes:(parent, args) => {
        // console.log({parent,args})
        console.log();
        return fakeData.notes.filter((note)=> note.folderId === parent.id)
    },
    },
    Mutation:{
        addFolder: async(parent, args)=>{
            const newFolder = new FolderModel({...args, authorId:'123'});
            return newFolder.save();
        },
        register:async (parent,args) =>{
            const existUser = await AuthorModel.findOne({uid: args.uid})
            
            if(!existUser){
                const newUser = new AuthorModel(args);
                await newUser.save();
                return newUser;
            }
        }
    }
  };
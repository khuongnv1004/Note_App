import fakeData from "../../../fakeData/index.js";
import { FolderModel, NoteModel, AuthorModel } from "../models/index.js";

export const resolvers = {
    Query: {
      folders: async (parent, args, context) => {
          const folders =  await FolderModel.find({authorId: context.uid}).sort({updatedAt:'desc'})

        return folders ;
      },
      folder: async (parent, args)=>{
        const folderId = args.folderId;
        const folders =  await FolderModel.findOne({
            _id:folderId
        })
        return folders;
      },
      note: async (parent, args)=>{
        const noteId = args.noteId;
        const note = await NoteModel.findOne({
          _id: noteId
        })
        return note
      }
    },
  
    Folder: {
      author: async (parent, args) => {
          const authorId = parent.authorId;
          const author =  await AuthorModel.findOne({uid: authorId})
        return author
      },
      notes: async(parent, args) => {
        // console.log({parent,args})
        console.log(parent.id);
        const notes = await NoteModel.find({
          folderId: parent.id
        })
        return notes;
    },
    },
    Mutation:{
        addFolder: async(parent, args, context)=>{
            const newFolder = new FolderModel({...args,authorId: context.uid });
            return newFolder.save();
        },
        register: async (parent,args) =>{
            const existUser = await AuthorModel.findOne({uid: args.uid})
            console.log(existUser);
            if(!existUser){
                const newUser = new AuthorModel(args);
                await newUser.save();
                console.log(newUser);
                return newUser;
            }

            return existUser;
        },
        addNote: async(parent, args, context)=>{
          const newNote = new NoteModel({...args});
          return newNote.save();
      },
      updateNote: async(parent, args, context)=>{
        const noteId = args.id;
        const note =  await NoteModel.findByIdAndUpdate(noteId, args)
        return note
    }
    }
  };
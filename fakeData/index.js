export default {
  author: [
    {
      id: 123,
      name: "KhuongNV",
    },
    {
        id: 1,
        name: "Khuong",
      },
  ],
  folders: [
    {
      id: "1",
      name: "Home",
      createdAt: " 2022-11-18",
      authorId: 1,
    },
    {
      id: "3",
      name: "New",
      createdAt: " 2022-11-18",
      authorId: 123,
    },
    {
      id: "2",
      name: "Folder",
      createdAt: " 2022-11-18",
      authorId: 123,
    },
  ],

  notes:[
    {
      id:'123',
      content:"<p>Go go</p>",
      folderId:"1"
    },
    {
      id:'12',
      content:"<p>Go go 2</p>",
      folderId:"2"
    },
    {
      id:'13',
      content:"<p>Go go 3</p>",
      folderId:"3"
    },
  ]
};

// ({
//     name: "", 
//     category: "face', 'body', 'hair",  
//     purpose:'moisturizing', 'repairing', 'sun protection', 'refreshing', 'anti-aging', 'purifying', 'perfuming', 'exfoliating',
//     time: ,
//     cost: ['low', 'medium', 'high',
//     materials:"",
//     level: 'easy', 'medium', 'difficult'
//     conservation: 
//     steps: ""
//     ingredients: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'ingredients', 
//         required: true
//     }],

//     rating: {
//         type: Number,
//         default: 0
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     date: {
//         type: Date, 
//         default: Date.now
//     },
//     image: {
//         type: String,
//         required: true,
//         default: '/images/defaultimg.jpeg'
//     }
// }, 
// {
//     timestamps: true
// }
// )
import Thumbnail1 from "./assets/flag1.jpg"
import Thumbnail2 from "./assets/flag2.jpg"
import Thumbnail3 from "./assets/flag3.png"
import Candidate1 from "./assets/candidate1.jpg"
import Candidate2 from "./assets/candidate2.jpg"
import Candidate3 from "./assets/candidate3.jpg"
import Candidate4 from "./assets/candidate4.jpg"
import Candidate5 from "./assets/candidate5.jpg"
import Candidate6 from "./assets/candidate6.jpg"
import Candidate7 from "./assets/candidate7.jpg"


export const elections = [
  {
    id: "e1",
    title: "Havard Presidential Elections",
    description: ` The point of using Lorem Ipsum is that it has a more-or-less 
        normal distribution of letters, as opposed to 
        using 'Content here, content here', making it 
        look like readable English. Many desktop publishing 
        packages and web page editors now use Lorem Ipsum as 
        their default model text, and a search for 'lorem ipsum' 
        will uncover many web sites still in their infancy. Various 
        versions have evolved over the years, sometimes by 
        accident, sometimes on purpose (injected humour and the like).`,
    thumbnail: Thumbnail1,
    candidates: ["c1", "c2", "c3", "c4"],
    voters: [],
  },
  {
    id: "e2",
    title: "Stanford University Presidential Election",
    description: ` The point of using Lorem Ipsum is that it has a more-or-less 
        normal distribution of letters, as opposed to 
        using 'Content here, content here', making it 
        look like readable English. Many desktop publishing 
        packages and web page editors now use Lorem Ipsum as 
        their default model text, and a search for 'lorem ipsum' 
        will uncover many web sites still in their infancy. Various 
        versions have evolved over the years, sometimes by 
        accident, sometimes on purpose (injected humour and the like).`,
    thumbnail: Thumbnail2,
    candidates: ["c5", "c6", "c7"],
    voters: [],
  },
  {
    id: "e3",
    title: "Legon SRC Presidential Elections",
    description: ` The point of using Lorem Ipsum is that it has a more-or-less 
        normal distribution of letters, as opposed to 
        using 'Content here, content here', making it 
        look like readable English. Many desktop publishing 
        packages and web page editors now use Lorem Ipsum as 
        their default model text, and a search for 'lorem ipsum' 
        will uncover many web sites still in their infancy. Various 
        versions have evolved over the years, sometimes by 
        accident, sometimes on purpose (injected humour and the like).`,
    thumbnail: Thumbnail3,
    candidates: [],
    voters: [],
  },
]; 







export const candidates = [
    {
        id: "c1",
        fullName: "Adam Turan",
        image: Candidate1,
        motto: `Altus suprem'os tutus de pelle ei Ghana.`,
        voteCount: 303,
        election: "e1",
    },
    {
        id: "c2",
        fullName: "Milingu Riches",
        image: Candidate2,
        motto: `Altus suprem'os tutus de pelle ei Ghana.`,
        voteCount: 110,
        election: "e1",
    },
    {
        id: "c3",
        fullName: "Dora Nova",
        image: Candidate3,
        motto: `Altus suprem'os tutus de pelle ei Ghana.`,
        voteCount: 272,
        election: "e2",
    },
    {
        id: "c4",
        fullName: "Korang Philemon",
        image: Candidate4,
        motto: `Altus suprem'os tutus de pelle ei Ghana.`,
        voteCount: 213,
        election: "e1",
    },
    {
        id: "c5",
        fullName: "Abdul Haq",
        image: Candidate5,
        motto: `Altus suprem'os tutus de pelle ei Ghana.`,
        voteCount: 203,
        election: "e2",
    },
    {
        id: "c6",
        fullName: "Sweety Billy",
        image: Candidate6,
        motto: `Altus suprem'os tutus de pelle ei Ghana.`,
        voteCount: 140,
        election: "e2",
    },
    {
        id: "c7",
        fullName: "Sheick Amri",
        image: Candidate7,
        motto: `Altus suprem'os tutus de pelle ei Ghana.`,
        voteCount: 333,
        election: "e2",
    },
]






export const voters = [
  {
    id: "v1",
    fullName: "Adam Riches",
    email: "admin@gmail.com",
    password: "admin123",
    isAdmin: true,
    votedElections: ["e2"],
  },
  {
    id: "v2",
    fullName: "Damian X",
    email: "damianx@x.com",
    password: "12345678",
    isAdmin: false,
    votedElections: ["e1","e2"],
  },
  {
    id: "v3",
    fullName: "Addo Dee",
    email: "addodee@gmail.com",
    password: "12345678",
    isAdmin: false,
    votedElections: ["e1","e2"],
  },
  {
    id: "v4",
    fullName: "Johnson AI",
    email: "johnson@gmail.com",
    password: "12345678",
    isAdmin: false,
    votedElections: [],
  },
  {
    id: "v5",
    fullName: "Mansir Dev",
    email: "dev@gmail.com",
    password: "12345678",
    isAdmin: false,
    votedElections: ["e2"],
  },
];
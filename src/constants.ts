export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  calories?: number;
}

export const CATEGORIES = [
  "All",
  "Burgers",
  "SNACKS & BITES",
  "KFC BRIYANI",
  "WRAPS & SUBMARINE",
  "HOT DRUMLETS",
  "CHEESY RANGE",
  "SIDES"
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "hc1",
    name: "1 Pc Choice (HC)",
    description: "1 piece of our signature Hot & Crispy chicken.",
    price: 900,
    category: "MAINS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/1pcchoicehc14cb274dd0e04d6bacf09c50825c79b7.jpg",
    calories: 230
  },
  {
    id: "hc2",
    name: "Quarter/2Pc (HC)",
    description: "2 pieces of our signature Hot & Crispy chicken.",
    price: 1400,
    category: "MAINS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/quarter2pchc9ef65c073e7b4f01a7ce12b0c326af47.jpg",
    calories: 460
  },
  {
    id: "hc3",
    name: "Half /4Pc (HC)",
    description: "4 pieces of our signature Hot & Crispy chicken.",
    price: 2600,
    category: "MAINS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/half4pchc545082dbc8734caa86f6779187909323.jpg",
    calories: 920
  },
  {
    id: "hc4",
    name: "BUCKET/6PC (H&C)",
    description: "6 pieces of our signature Hot & Crispy chicken. Perfect for sharing.",
    price: 3750,
    category: "MAINS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/bucket6pchce6da3a3f713349de91e51500c7168367.jpg",
    calories: 1380
  },
  {
    id: "hc5",
    name: "Full/8Pc (HC)",
    description: "8 pieces of our signature Hot & Crispy chicken bucket.",
    price: 4950,
    category: "MAINS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/full8pchca20713a1c7c342fead3b6932415376bf.jpg",
    calories: 1840
  },
  {
    id: "hc6",
    name: "Bucket/12 Pc (HC)",
    description: "12 pieces of our signature Hot & Crispy chicken. The ultimate family bucket.",
    price: 7450,
    category: "MAINS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/bucket12pchca2f5a80314544b0e89d86ab96ea23d5f.jpg",
    calories: 2760
  },
  {
    id: "bg1",
    name: "KFC Zinger Burger",
    description: "Signature spicy crispy chicken fillet, fresh lettuce, and creamy mayo in a toasted sesame bun.",
    price: 1450,
    category: "Burgers",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/kfczingerburgere4661b9f722a4f51b8fb30bbf4349e40.jpg",
    calories: 450
  },
  {
    id: "bg2",
    name: "KFC Zinger Burger with Cheese",
    description: "Signature spicy crispy chicken fillet, fresh lettuce, creamy mayo, and a slice of cheese in a toasted sesame bun.",
    price: 1650,
    category: "Burgers",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/kfczingerburgerwithcheese3db0aa7f55e54af9ae2c98dd195a6c45.jpg",
    calories: 520
  },
  {
    id: "bg3",
    name: "PREMIUM TANDOORI BURGER",
    description: "Crispy chicken fillet glazed with authentic tandoori sauce, fresh onions, lettuce, and mayo in a premium bun.",
    price: 1850,
    category: "Burgers",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/premiumtandooriburger1dfbacba7b334b38a9257b2c7859461b.jpg",
    calories: 550
  },
  {
    id: "bg4",
    name: "PREMIUM NASHVILLE BURGER",
    description: "Crispy chicken fillet coated in spicy Nashville hot sauce, pickles, lettuce, and mayo in a premium bun.",
    price: 1850,
    category: "Burgers",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/premiumnashvilleburger81e3afa4dd65426cb49c2d2231045a4a.jpg",
    calories: 580
  },
  {
    id: "bg5",
    name: "Double Decker Burger",
    description: "Two crispy chicken fillets, fresh lettuce, cheese, and signature sauces stacked high in a toasted sesame bun.",
    price: 2250,
    category: "Burgers",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/doubledeckerburger1ad4a3e6c8a74875b511c8d3816b3ea9.jpg",
    calories: 850
  },
  {
    id: "bg6",
    name: "Veggie Burger",
    description: "Crispy vegetable patty, fresh lettuce, tomatoes, and tangy mayo in a toasted sesame bun.",
    price: 1180,
    category: "Burgers",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/vegieburgereaf2b553e7aa4da1a753669e0cd185a0.jpg",
    calories: 400
  },
  {
    id: "bg7",
    name: "Veggie Burger + Cheese",
    description: "Crispy vegetable patty, fresh lettuce, tomatoes, tangy mayo, and a slice of cheese in a toasted sesame bun.",
    price: 1380,
    category: "Burgers",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/vegieburgercheese72cd1916e1424cd9a03838afa8bd2d04.jpg",
    calories: 470
  },
  {
    id: "sb1",
    name: "Crispy Strips 2PC",
    description: "2 pieces of our signature crispy chicken strips.",
    price: 750,
    category: "SNACKS & BITES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/crispystrips2pc810c97449b404ba49d925c7edc0f91a6.jpg",
    calories: 250
  },
  {
    id: "sb2",
    name: "Snacker",
    description: "A perfect snack-sized burger with a crispy chicken patty.",
    price: 750,
    category: "SNACKS & BITES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/snacker4c98e8c8c68449799e7f22e6db984e99.jpg",
    calories: 300
  },
  {
    id: "sb3",
    name: "Snacker with Cheese",
    description: "A perfect snack-sized burger with a crispy chicken patty and cheese.",
    price: 850,
    category: "SNACKS & BITES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/snackercheese1509e70a5e204209856222537577fc94.jpg",
    calories: 350
  },
  {
    id: "sb4",
    name: "H&C Bites 9PC",
    description: "9 pieces of bite-sized Hot & Crispy chicken.",
    price: 1100,
    category: "SNACKS & BITES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/hcbites9pcc57ab9f6c53842718ee62ef780562f1e.jpg",
    calories: 400
  },
  {
    id: "sb5",
    name: "H&C Bites 20PC",
    description: "20 pieces of bite-sized Hot & Crispy chicken. Great for sharing!",
    price: 2200,
    category: "SNACKS & BITES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/hcbites20pc6aaa66198529413aaaf8d50d08971374.jpg",
    calories: 850
  },
  {
    id: "r1",
    name: "KFC Briyani (R)",
    description: "Aromatic basmati rice cooked with flavorful spices, served with a piece of Hot & Crispy chicken and gravy.",
    price: 850,
    category: "KFC BRIYANI",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/kfcburiyanir9dfa4992da994392a1576c4f2dd6c60b.jpg",
    calories: 650
  },
  {
    id: "r2",
    name: "KFC Briyani (L)",
    description: "A larger portion of our signature spicy biryani rice, served with two pieces of Hot & Crispy chicken and gravy.",
    price: 1250,
    category: "KFC BRIYANI",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/kfcburiyanilc3825a0a1b9b416b8789228ff1b63836.jpg",
    calories: 950
  },
  {
    id: "r3",
    name: "KFC Spicy Rice",
    description: "Flavorful, spicy seasoned rice. The perfect side for your chicken.",
    price: 450,
    category: "KFC BRIYANI",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/kfcspicerice7222cc11faef490f879af028586acc90.jpg",
    calories: 320
  },
  {
    id: "r4",
    name: "KFC Sawan",
    description: "The ultimate sharing meal! A massive platter of flavorful biryani rice topped with 6 pieces of Hot & Crispy chicken, accompanied by sides.",
    price: 4800,
    category: "KFC BRIYANI",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/kfcsawanfc5687921b074addaae93c9483b03a0d.jpg",
    calories: 3200
  },
  {
    id: "ws1",
    name: "Twister",
    description: "Crispy chicken strips, fresh lettuce, and diced tomatoes wrapped in a warm tortilla with pepper mayo.",
    price: 1450,
    category: "WRAPS & SUBMARINE",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/twister76fadc37cd5a495c94e7e9504c0a7c86.jpg",
    calories: 430
  },
  {
    id: "ws2",
    name: "Twister + Cheese",
    description: "Crispy chicken strips, fresh lettuce, diced tomatoes, and cheese wrapped in a warm tortilla with pepper mayo.",
    price: 1650,
    category: "WRAPS & SUBMARINE",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/twistercheesec30e1264fe91459399d9ed1bf1f791c6.jpg",
    calories: 510
  },
  {
    id: "ws3",
    name: "Submarine Regular",
    description: "A delicious submarine sandwich filled with crispy chicken, fresh veggies, and signature sauces.",
    price: 850,
    category: "WRAPS & SUBMARINE",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/submarineregular2fb87dae90744329b328cdba86e8ee01.jpg",
    calories: 450
  },
  {
    id: "hd1",
    name: "Hot Drumlets 6PC",
    description: "6 pieces of spicy, crispy chicken drumlets.",
    price: 1400,
    category: "HOT DRUMLETS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/hotdrumlets6pc05bb32cb99ef464898de858c9bf1f8d6.jpg",
    calories: 540
  },
  {
    id: "hd2",
    name: "HOT Drumlets 20PC",
    description: "20 pieces of spicy, crispy chicken drumlets. Perfect for sharing!",
    price: 4600,
    category: "HOT DRUMLETS",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/hotdrumlets20pcsbb26ecfd064e4752a6230d5acb20666e.jpg",
    calories: 1800
  },
  {
    id: "cr1",
    name: "CHEESY SHAWARMA",
    description: "A delicious and cheesy shawarma wrap loaded with flavor.",
    price: 1290,
    category: "CHEESY RANGE",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/cheesyshawarma8800c6b59507423c9aa6d71899c887e7.jpg",
    calories: 550
  },
  {
    id: "sd1",
    name: "Onion Sambol",
    description: "A spicy and tangy onion relish, perfect to accompany your meal.",
    price: 200,
    category: "SIDES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/onionsambol06ba4e74bf624c1eb92099de7b76f04a.jpg",
    calories: 80
  },
  {
    id: "sd2",
    name: "Rice Pilaf",
    description: "Flavorful seasoned rice pilaf.",
    price: 350,
    category: "SIDES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/ricepillaf32e7f7667af24fcdb2afec3c3d6f7dfc.jpg",
    calories: 220
  },
  {
    id: "sd3",
    name: "Gravy",
    description: "Our signature rich and savory gravy.",
    price: 100,
    category: "SIDES",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/gravyc2e1ebcc5510435585c01a10c7886a32.jpg",
    calories: 50
  }
];

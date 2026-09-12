import { Recipe } from "../types";

export const WORLD_KITCHEN_MEALS: Recipe[] = [
  {
    id: "wk-shepherds-pie",
    title: "Shepherd's Pie",  // Origin: Britain and Ireland
    time: "Serves 4",
    cost: 2.64,
    costPerServing: 0.66,
    image: "/recipes/fyf-shepherds-pie.png",
    category: "under2",
    tags: ["British And Irish"],
    cuisine: "British And Irish",
    ingredients: [
      "400g lean lamb mince",
      "1 onion, diced",
      "2 carrots, diced",
      "150g peas",
      "1 tbsp tomato puree",
      "400ml low-salt stock",
      "700g white potatoes",
      "100ml reduced-fat milk",
      "1 tsp butter",
      "1 tsp Worcestershire sauce",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Boil the potatoes; mash with milk, butter and pepper.",
      "Brown the lamb, then soften the onion and carrots in the same pan.",
      "Add puree, Worcestershire sauce and stock; simmer until thick, then add peas.",
      "Top with mash and bake at 200C until golden."
    ],
    chefTips: "Keep the traditional lamb filling, but use lean mince, measured butter and plenty of vegetables.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "9g"
    }
  },
  {
    id: "wk-lancashire-hotpot",
    title: "Lancashire Hotpot",  // Origin: Lancashire, England
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/fyf-lancashire-hotpot.jpeg",
    category: "under2",
    tags: ["British And Irish"],
    cuisine: "British And Irish",
    ingredients: [
      "500g lean diced lamb",
      "2 onions, sliced",
      "2 carrots, sliced",
      "600g white potatoes, thinly sliced",
      "500ml low-salt stock",
      "1 bay leaf",
      "1 tsp rapeseed oil",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Brown the lamb lightly in oil and place in a casserole.",
      "Add onions, carrots, bay and stock.",
      "Arrange overlapping potato slices on top and season lightly.",
      "Cover and bake at 170C for 90 minutes; uncover to brown the potatoes."
    ],
    chefTips: "A one-pot regional dish; a larger vegetable layer moderates the meat portion.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-fish-pie",
    title: "Fish Pie",  // Origin: Britain
    time: "Serves 4",
    cost: 2.88,
    costPerServing: 0.72,
    image: "/recipes/fyf-fish-pie.jpeg",
    category: "under2",
    tags: ["British And Irish"],
    cuisine: "British And Irish",
    ingredients: [
      "400g sustainably sourced white fish",
      "150g salmon",
      "150g peas",
      "600g white potatoes",
      "400ml reduced-fat milk",
      "30g wholemeal flour",
      "20g butter",
      "Fresh parsley",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Boil and mash the potatoes with a little milk and half the butter.",
      "Gently poach the fish in the remaining milk; remove and flake.",
      "Melt the remaining butter, stir in flour, then gradually add the poaching milk; add fish, peas and parsley.",
      "Top with mash and bake at 190C until bubbling and golden."
    ],
    chefTips: "Poaching the fish builds flavour into the sauce and avoids unnecessary waste.",
    nutrition: {
      calories: 315,
      protein: "24g",
      carbs: "30g",
      fiber: "4g"
    }
  },
  {
    id: "wk-chicken-and-leek-traybake",
    title: "Chicken and Leek Traybake",  // Origin: Britain
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/fyf-chicken-and-leek-traybake.jpeg",
    category: "under2",
    tags: ["British And Irish"],
    cuisine: "British And Irish",
    ingredients: [
      "600g skinless chicken thighs",
      "2 leeks, thickly sliced",
      "500g white potatoes, cubed",
      "2 carrots, chopped",
      "1 tbsp rapeseed oil",
      "1 tsp dried thyme",
      "1 lemon",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Heat the oven to 200C.",
      "Toss potatoes, carrots and leeks with oil, thyme and pepper.",
      "Place chicken on top, add a measured pinch of salt and roast for 35-40 minutes.",
      "Check the chicken is thoroughly cooked and finish with lemon."
    ],
    chefTips: "A familiar roast-style meal cooked efficiently on one tray.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-irish-lamb-stew",
    title: "Irish Lamb Stew",  // Origin: Ireland
    time: "Serves 4",
    cost: 2.24,
    costPerServing: 0.56,
    image: "/recipes/fyf-irish-lamb-stew.jpeg",
    category: "under2",
    tags: ["British And Irish"],
    cuisine: "British And Irish",
    ingredients: [
      "500g lean diced lamb",
      "1 onion, sliced",
      "3 carrots, chopped",
      "600g white potatoes, halved",
      "750ml low-salt stock",
      "1 bay leaf",
      "Fresh parsley",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Place lamb in a saucepan, cover with stock and bring gently to a simmer.",
      "Skim if needed, then add onion, carrots and bay.",
      "Add potatoes and simmer gently until lamb and vegetables are tender.",
      "Remove bay, season carefully and finish with parsley."
    ],
    chefTips: "The simple broth, lamb and root vegetables preserve the character of this traditional stew.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-pasta-e-ceci",
    title: "Pasta e Ceci",  // Origin: Central and Southern Italy
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/fyf-pasta-e-ceci.png",
    category: "under2",
    tags: ["Italian"],
    cuisine: "Italian",
    ingredients: [
      "240g chickpeas",
      "240g wholewheat pasta",
      "1 onion, finely diced",
      "1 carrot, finely diced",
      "400g tinned chopped tomatoes",
      "1 garlic clove",
      "1 tsp olive oil",
      "1 tsp dried rosemary",
      "750ml low-salt vegetable stock",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Soften onion and carrot in olive oil; add garlic and rosemary.",
      "Add tomatoes, chickpeas and stock; simmer for 15 minutes.",
      "Add pasta directly to the pan and cook until tender, adding water as needed.",
      "Mash a few chickpeas to thicken, then season carefully."
    ],
    chefTips: "A traditional pulse-and-pasta dish that combines affordability, fibre and plant protein.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "10g"
    }
  },
  {
    id: "wk-pollo-alla-cacciatora",
    title: "Pollo alla Cacciatora",  // Origin: Italy
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-pollo-alla-cacciatora.png",
    category: "under2",
    tags: ["Italian"],
    cuisine: "Italian",
    ingredients: [
      "600g skinless chicken thighs",
      "1 onion, sliced",
      "1 carrot, diced",
      "200g mushrooms",
      "400g tinned chopped tomatoes",
      "2 garlic cloves",
      "1 tbsp olive oil",
      "1 tsp dried rosemary",
      "1 bay leaf",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Brown the chicken lightly in oil and set aside.",
      "Soften onion, carrot and mushrooms; add garlic and rosemary.",
      "Return chicken with tomatoes and bay.",
      "Cover and simmer until the chicken is thoroughly cooked; uncover briefly to reduce the sauce."
    ],
    chefTips: "This home-style hunter's chicken relies on vegetables, herbs and slow cooking for flavour.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "10g"
    }
  },
  {
    id: "wk-melanzane-alla-parmigiana",
    title: "Melanzane alla Parmigiana",  // Origin: Southern Italy
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-melanzane-alla-parmigiana.jpeg",
    category: "under2",
    tags: ["Italian"],
    cuisine: "Italian",
    ingredients: [
      "2 aubergines, sliced",
      "500g tomato passata",
      "2 garlic cloves",
      "1 tsp olive oil",
      "1 tsp dried basil",
      "150g mozzarella",
      "40g Parmesan",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Lightly salt the aubergine, rest for 20 minutes, then pat dry.",
      "Brush lightly with oil and bake at 210C until tender.",
      "Layer aubergine with passata, garlic, basil, mozzarella and Parmesan.",
      "Bake at 190C for 30 minutes and rest before serving."
    ],
    chefTips: "Baking rather than frying the aubergine is a realistic healthier adaptation.",
    nutrition: {
      calories: 200,
      protein: "12g",
      carbs: "20g",
      fiber: "8g"
    }
  },
  {
    id: "wk-risotto-primavera",
    title: "Risotto Primavera",  // Origin: Northern Italy
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-risotto-primavera.jpeg",
    category: "under2",
    tags: ["Italian"],
    cuisine: "Italian",
    ingredients: [
      "300g Arborio rice",
      "1 onion, finely diced",
      "1 courgette, diced",
      "150g peas",
      "150g asparagus or broccoli",
      "1 litre low-salt vegetable stock",
      "1 tbsp olive oil",
      "30g butter",
      "50g Parmesan",
      "Fresh basil",
      "Black pepper"
    ],
    instructions: [
      "Keep the stock hot in a separate pan.",
      "Soften onion in oil; add rice and stir for 1 minute.",
      "Add stock one ladle at a time, stirring; add vegetables according to cooking time.",
      "When creamy and al dente, remove from heat and beat in butter, Parmesan and basil."
    ],
    chefTips: "A measured amount of cheese and butter finishes the dish; vegetables remain central.",
    nutrition: {
      calories: 240,
      protein: "12g",
      carbs: "30g",
      fiber: "9g"
    }
  },
  {
    id: "wk-lenticchie-in-umido-with-wholegrain-bread",
    title: "Lenticchie in Umido with Wholegrain Bread",  // Origin: Italy
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-lenticchie-in-umido-with-wholegrain-bread.jpeg",
    category: "under2",
    tags: ["Italian"],
    cuisine: "Italian",
    ingredients: [
      "400g cooked lentils",
      "1 onion, diced",
      "1 carrot, diced",
      "1 celery stick, diced",
      "400g tinned chopped tomatoes",
      "1 garlic clove",
      "1 tsp olive oil",
      "1 bay leaf",
      "1 tsp dried rosemary",
      "4 slices wholemeal bread",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Soften onion, carrot and celery in olive oil.",
      "Add garlic, bay and rosemary, then tomatoes and lentils.",
      "Simmer gently for 20 minutes, adding water if required.",
      "Season lightly and serve with toasted wholemeal bread."
    ],
    chefTips: "Italian-style braised lentils make a substantial plant-based main meal.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "10g"
    }
  },
  {
    id: "wk-chana-masala",
    title: "Chana Masala",  // Origin: North India
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-chana-masala.jpeg",
    category: "under2",
    tags: ["Indian"],
    cuisine: "Indian",
    ingredients: [
      "480g chickpeas",
      "1 onion, finely diced",
      "400g tinned chopped tomatoes",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "1 tsp rapeseed oil",
      "2 tsp ground coriander",
      "1 tsp ground cumin",
      "1 tsp garam masala",
      "1/2 tsp turmeric",
      "1/2 tsp chilli powder",
      "Fresh coriander",
      "Small pinch of salt"
    ],
    instructions: [
      "Soften onion in oil until golden; add garlic and ginger.",
      "Add ground spices and stir briefly.",
      "Add tomatoes and chickpeas; simmer until thick and well combined.",
      "Season carefully and finish with garam masala and fresh coriander."
    ],
    chefTips: "Whole spices and a well-cooked onion-tomato base create flavour without a heavy sauce.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "8g"
    }
  },
  {
    id: "wk-masoor-dal-tadka",
    title: "Masoor Dal Tadka",  // Origin: India
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-masoor-dal-tadka.jpeg",
    category: "under2",
    tags: ["Indian"],
    cuisine: "Indian",
    ingredients: [
      "300g red lentils",
      "1 onion, finely diced",
      "2 fresh tomatoes, chopped",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "1 tsp rapeseed oil",
      "1 tsp ground cumin",
      "1/2 tsp turmeric",
      "1/2 tsp chilli powder",
      "Fresh coriander",
      "Small pinch of salt"
    ],
    instructions: [
      "Rinse lentils and simmer with turmeric until soft.",
      "In a separate pan, cook onion in oil until golden; add garlic, ginger, cumin and chilli.",
      "Add tomatoes and cook until broken down.",
      "Stir the tadka into the lentils, season and finish with coriander."
    ],
    chefTips: "A classic pulse-based dish with economical protein and measured oil.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "8g"
    }
  },
  {
    id: "wk-aloo-gobi",
    title: "Aloo Gobi",  // Origin: North India
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-aloo-gobi.jpeg",
    category: "under2",
    tags: ["Indian"],
    cuisine: "Indian",
    ingredients: [
      "500g white potatoes, cubed",
      "1 cauliflower, in florets",
      "1 onion, sliced",
      "2 fresh tomatoes, chopped",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "1 tbsp rapeseed oil",
      "1 tsp ground cumin",
      "1 tsp ground coriander",
      "1/2 tsp turmeric",
      "Fresh coriander",
      "Small pinch of salt"
    ],
    instructions: [
      "Heat oil and cook cumin briefly, then add onion.",
      "Add garlic, ginger, coriander and turmeric.",
      "Add potatoes, cauliflower and tomatoes; mix well.",
      "Cover and cook gently until tender, adding only a splash of water; finish with coriander."
    ],
    chefTips: "This dry-style vegetable dish keeps cauliflower and potato as the focus.",
    nutrition: {
      calories: 240,
      protein: "12g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-palak-paneer",
    title: "Palak Paneer",  // Origin: North India
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-palak-paneer.jpeg",
    category: "under2",
    tags: ["Indian"],
    cuisine: "Indian",
    ingredients: [
      "300g paneer, cubed",
      "500g spinach",
      "1 onion, diced",
      "2 fresh tomatoes, chopped",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "1 tsp rapeseed oil",
      "1 tsp ground cumin",
      "1 tsp garam masala",
      "1/2 tsp turmeric",
      "Small pinch of salt"
    ],
    instructions: [
      "Blanch the spinach briefly, cool and blend.",
      "Lightly colour the paneer in half the oil and set aside.",
      "Cook onion in remaining oil; add garlic, ginger, spices and tomatoes.",
      "Add spinach and paneer, simmer briefly and season carefully."
    ],
    chefTips: "Spinach provides the body of the sauce; paneer is used in a measured portion.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "8g"
    }
  },
  {
    id: "wk-chicken-tikka-with-roasted-peppers",
    title: "Chicken Tikka with Roasted Peppers",  // Origin: Punjab/North India
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-chicken-tikka-with-roasted-peppers.jpeg",
    category: "under2",
    tags: ["Indian"],
    cuisine: "Indian",
    ingredients: [
      "600g skinless chicken thighs",
      "150g natural yoghurt",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "1 tsp garam masala",
      "1 tsp ground cumin",
      "1 tsp smoked paprika",
      "1/2 tsp turmeric",
      "1 lemon",
      "2 peppers, chopped",
      "1 onion, cut into wedges",
      "Small pinch of salt"
    ],
    instructions: [
      "Mix yoghurt, garlic, ginger, spices, lemon and salt; coat the chicken and chill.",
      "Heat the oven to 210C.",
      "Spread peppers and onion on a tray and place chicken on top.",
      "Roast until charred at the edges and thoroughly cooked."
    ],
    chefTips: "The yoghurt-spice marinade and high-heat cooking retain the defining tikka approach; the oven tray makes it practical at home.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "6g"
    }
  },
  {
    id: "wk-fan-qie-chao-dan--tomato-and-egg",
    title: "Fan Qie Chao Dan - Tomato and Egg",  // Origin: China
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-fan-qie-chao-dan--tomato-and-egg.jpeg",
    category: "under2",
    tags: ["Gluten-Free", "Chinese"],
    cuisine: "Chinese",
    ingredients: [
      "6 eggs",
      "5 ripe tomatoes, cut into wedges",
      "3 spring onions, sliced",
      "1 tsp rapeseed oil",
      "1 tsp sesame oil",
      "1 tsp reduced-salt soy sauce",
      "Small pinch of salt",
      "200g brown rice"
    ],
    instructions: [
      "Cook the rice.",
      "Beat eggs with a pinch of salt; softly scramble in rapeseed oil and remove.",
      "Cook tomato and spring onion until juicy, then add soy sauce.",
      "Return eggs, fold together and finish with sesame oil."
    ],
    chefTips: "A widely cooked Chinese home dish pairing eggs with sweet-sharp tomatoes.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-mapo-tofu",
    title: "Mapo Tofu",  // Origin: Sichuan, China
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-mapo-tofu.jpeg",
    category: "under2",
    tags: ["Chinese"],
    cuisine: "Chinese",
    ingredients: [
      "400g soft tofu, cubed",
      "150g lean pork mince",
      "2 tbsp doubanjiang",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "3 spring onions, sliced",
      "1 tsp Sichuan pepper",
      "1 tsp rapeseed oil",
      "1 tsp reduced-salt soy sauce",
      "1 tsp cornflour",
      "200g brown rice"
    ],
    instructions: [
      "Cook the rice; mix cornflour with water.",
      "Brown pork in oil; add doubanjiang, garlic, ginger and half the spring onion.",
      "Add water, soy sauce and tofu; simmer gently without breaking the tofu.",
      "Thicken lightly with cornflour, then finish with Sichuan pepper and spring onion."
    ],
    chefTips: "Doubanjiang and Sichuan pepper are essential to the dish's characteristic flavour; use measured soy sauce.",
    nutrition: {
      calories: 315,
      protein: "24g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-cantonesestyle-steamed-fish",
    title: "Cantonese-Style Steamed Fish",  // Origin: Guangdong, China
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-cantonesestyle-steamed-fish.jpeg",
    category: "under2",
    tags: ["Gluten-Free", "Chinese"],
    cuisine: "Chinese",
    ingredients: [
      "600g whole fish or fish fillets",
      "4 spring onions, shredded",
      "2 tbsp fresh ginger, shredded",
      "1 tbsp reduced-salt soy sauce",
      "1 tsp sesame oil",
      "1 tsp rapeseed oil",
      "200g brown rice",
      "200g broccoli"
    ],
    instructions: [
      "Cook the rice and steam the broccoli.",
      "Place fish on a heatproof plate with half the ginger and steam until just cooked.",
      "Discard collected liquid and top with spring onion and remaining ginger.",
      "Warm the oils carefully, spoon over the aromatics and finish with soy sauce."
    ],
    chefTips: "Steaming preserves the clean flavour and texture associated with Cantonese fish cookery.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-ginger-and-spring-onion-chicken",
    title: "Ginger and Spring Onion Chicken",  // Origin: Cantonese-style
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-ginger-and-spring-onion-chicken.jpeg",
    category: "under2",
    tags: ["Chinese"],
    cuisine: "Chinese",
    ingredients: [
      "500g skinless chicken thighs, sliced",
      "6 spring onions, cut into lengths",
      "2 tbsp fresh ginger, sliced",
      "1 garlic clove",
      "1 tbsp reduced-salt soy sauce",
      "1 tsp sesame oil",
      "1 tsp rapeseed oil",
      "1 tsp cornflour",
      "250g wholegrain noodles"
    ],
    instructions: [
      "Cook the noodles; mix chicken with cornflour and soy sauce.",
      "Stir-fry chicken in rapeseed oil until nearly cooked.",
      "Add ginger, garlic and spring onions and cook until fragrant.",
      "Check chicken is cooked, finish with sesame oil and toss with noodles."
    ],
    chefTips: "Ginger and spring onion provide the defining flavour, keeping the ingredient list focused.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "4g"
    }
  },
  {
    id: "wk-yu-xiang-aubergine",
    title: "Yu Xiang Aubergine",  // Origin: Sichuan, China
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-yu-xiang-aubergine.jpeg",
    category: "under2",
    tags: ["Chinese"],
    cuisine: "Chinese",
    ingredients: [
      "2 aubergines, cut into batons",
      "1 tbsp doubanjiang",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "3 spring onions, sliced",
      "1 tbsp rice vinegar",
      "1 tsp reduced-salt soy sauce",
      "1 tsp cornflour",
      "1 tbsp rapeseed oil",
      "200g brown rice"
    ],
    instructions: [
      "Cook the rice; steam or microwave aubergine until partly tender.",
      "Stir-fry doubanjiang, garlic, ginger and spring onion whites in oil.",
      "Add aubergine, soy sauce, vinegar and a splash of water.",
      "Thicken lightly with cornflour and finish with spring onion greens."
    ],
    chefTips: "Pre-cooking the aubergine reduces oil while retaining the garlic, ginger, chilli and vinegar profile.",
    nutrition: {
      calories: 280,
      protein: "12g",
      carbs: "40g",
      fiber: "6g"
    }
  },
  {
    id: "wk-jerk-chicken-traybake",
    title: "Jerk Chicken Traybake",  // Origin: Jamaica
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-jerk-chicken-traybake.jpeg",
    category: "under2",
    tags: ["Caribbean - Jamaican"],
    cuisine: "Caribbean - Jamaican",
    ingredients: [
      "600g skinless chicken thighs",
      "1 tsp ground allspice",
      "1 tsp dried thyme",
      "1 Scotch bonnet, finely chopped",
      "3 spring onions, chopped",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "1 lime",
      "1 tbsp rapeseed oil",
      "600g sweet potatoes, cubed",
      "2 peppers, chopped",
      "Small pinch of salt"
    ],
    instructions: [
      "Blend or finely mix allspice, thyme, chilli, spring onion, garlic, ginger, lime, oil and salt.",
      "Coat chicken and marinate, ideally overnight.",
      "Roast sweet potato and peppers at 200C for 15 minutes.",
      "Add chicken and roast until thoroughly cooked and lightly charred."
    ],
    chefTips: "Allspice, thyme and Scotch bonnet are central jerk flavours; adjust chilli heat without removing character.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-brown-stew-chicken",
    title: "Brown Stew Chicken",  // Origin: Jamaica
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-brown-stew-chicken.jpeg",
    category: "under2",
    tags: ["Caribbean - Jamaican"],
    cuisine: "Caribbean - Jamaican",
    ingredients: [
      "600g skinless chicken thighs",
      "1 onion, sliced",
      "2 spring onions, chopped",
      "1 pepper, sliced",
      "2 fresh tomatoes, chopped",
      "2 garlic cloves",
      "1 tsp dried thyme",
      "1 tsp ground allspice",
      "1 tsp Jamaican browning",
      "1 tsp rapeseed oil",
      "Small pinch of salt"
    ],
    instructions: [
      "Season chicken with thyme, allspice, garlic, spring onion, browning and salt.",
      "Brown chicken in oil and set aside.",
      "Soften onion, pepper and tomatoes, then return chicken with a little water.",
      "Cover and simmer until thoroughly cooked and the gravy has reduced."
    ],
    chefTips: "Browning, thyme and allspice give the stew its recognisable Jamaican character.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "9g"
    }
  },
  {
    id: "wk-rice-and-peas",
    title: "Rice and Peas",  // Origin: Jamaica
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-rice-and-peas.jpeg",
    category: "under2",
    tags: ["Caribbean - Jamaican"],
    cuisine: "Caribbean - Jamaican",
    ingredients: [
      "250g brown rice",
      "240g kidney beans",
      "400ml coconut milk",
      "3 spring onions",
      "2 garlic cloves",
      "1 tsp dried thyme",
      "1 tsp ground allspice",
      "1 whole Scotch bonnet",
      "Small pinch of salt"
    ],
    instructions: [
      "Rinse the rice and place in a pan with beans, coconut milk and enough water.",
      "Add spring onion, garlic, thyme, allspice and the whole Scotch bonnet.",
      "Cover and cook gently until rice is tender; do not burst the chilli.",
      "Remove the chilli, fluff the rice and season carefully."
    ],
    chefTips: "In Jamaica, 'peas' commonly refers to kidney beans or gungo peas; coconut and thyme are traditional flavours.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-jamaican-curry-chicken",
    title: "Jamaican Curry Chicken",  // Origin: Jamaica
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-jamaican-curry-chicken.jpeg",
    category: "under2",
    tags: ["Caribbean - Jamaican"],
    cuisine: "Caribbean - Jamaican",
    ingredients: [
      "600g skinless chicken thighs",
      "1 onion, sliced",
      "2 spring onions, chopped",
      "2 white potatoes, cubed",
      "2 garlic cloves",
      "1 tbsp fresh ginger",
      "2 tbsp Jamaican curry powder",
      "1 tsp dried thyme",
      "1 Scotch bonnet",
      "1 tsp rapeseed oil",
      "Small pinch of salt"
    ],
    instructions: [
      "Coat chicken with curry powder, thyme, garlic, ginger and salt.",
      "Toast a little curry powder in oil, then brown the chicken.",
      "Add onion, spring onion, potato, chilli and enough water to simmer.",
      "Cover and cook until chicken and potatoes are tender; reduce the gravy."
    ],
    chefTips: "Jamaican curry powder, thyme and Scotch bonnet distinguish this from South Asian curries.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-ital-vegetable-and-bean-stew",
    title: "Ital Vegetable and Bean Stew",  // Origin: Jamaica/Rastafari tradition
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-ital-vegetable-and-bean-stew.jpeg",
    category: "under2",
    tags: ["Caribbean - Jamaican"],
    cuisine: "Caribbean - Jamaican",
    ingredients: [
      "240g kidney beans",
      "240g butter beans",
      "400ml coconut milk",
      "1 sweet potato, cubed",
      "1 carrot, sliced",
      "1 pepper, chopped",
      "100g spinach",
      "3 spring onions",
      "2 garlic cloves",
      "1 tsp dried thyme",
      "1 tsp ground allspice",
      "1 Scotch bonnet"
    ],
    instructions: [
      "Place beans, coconut milk, sweet potato, carrot, pepper and aromatics in a saucepan.",
      "Add enough water to cover and simmer gently.",
      "Keep the Scotch bonnet whole for gentler heat.",
      "When vegetables are tender, stir in spinach and remove the chilli before serving."
    ],
    chefTips: "Ital cooking is plant-based and often avoids processed ingredients; this version builds flavour without added salt.",
    nutrition: {
      calories: 315,
      protein: "24g",
      carbs: "30g",
      fiber: "12g"
    }
  },
  {
    id: "wk-mujaddara",
    title: "Mujaddara",  // Origin: Levant
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-mujaddara.jpeg",
    category: "under2",
    tags: ["Middle Eastern - Levant"],
    cuisine: "Middle Eastern - Levant",
    ingredients: [
      "250g brown lentils",
      "200g brown rice",
      "4 onions, thinly sliced",
      "2 tbsp olive oil",
      "1 tsp ground cumin",
      "1/2 tsp ground cinnamon",
      "Black pepper",
      "Small pinch of salt",
      "200g natural yoghurt, optional"
    ],
    instructions: [
      "Cook lentils until partly tender, then add rice and continue until both are cooked.",
      "Slowly cook onions in olive oil until deeply golden and crisp at the edges.",
      "Stir cumin, cinnamon and half the onions through the lentil-rice mixture.",
      "Season and top with remaining onions; serve with yoghurt if desired."
    ],
    chefTips: "The deeply browned onions are central to this traditional lentil-and-rice dish.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-musakhanstyle-chicken-traybake",
    title: "Musakhan-Style Chicken Traybake",  // Origin: Palestine
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-musakhanstyle-chicken-traybake.jpeg",
    category: "under2",
    tags: ["Middle Eastern - Levant"],
    cuisine: "Middle Eastern - Levant",
    ingredients: [
      "600g skinless chicken thighs",
      "4 onions, sliced",
      "2 tbsp olive oil",
      "2 tbsp sumac",
      "1 tsp ground allspice",
      "4 wholegrain flatbreads",
      "1 lemon",
      "30g pine nuts, optional",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Coat chicken with sumac, allspice, lemon, pepper and salt.",
      "Slowly soften onions in olive oil until sweet.",
      "Roast chicken at 200C until thoroughly cooked.",
      "Place onions and chicken over warmed flatbreads; finish with sumac and pine nuts."
    ],
    chefTips: "Sumac, olive oil, onions and bread preserve the defining Palestinian flavour combination.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "6g"
    }
  },
  {
    id: "wk-kofta-and-vegetable-traybake",
    title: "Kofta and Vegetable Traybake",  // Origin: Levant
    time: "Serves 4",
    cost: 2.28,
    costPerServing: 0.57,
    image: "/recipes/wk-kofta-and-vegetable-traybake.jpeg",
    category: "under2",
    tags: ["Middle Eastern - Levant"],
    cuisine: "Middle Eastern - Levant",
    ingredients: [
      "500g lean lamb mince",
      "1 onion, finely grated",
      "Fresh parsley, chopped",
      "1 tsp ground cumin",
      "1 tsp ground allspice",
      "1/2 tsp ground cinnamon",
      "500g white potatoes, sliced",
      "2 fresh tomatoes, sliced",
      "1 tbsp olive oil",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Mix lamb with onion, parsley and spices; shape into small kofta.",
      "Arrange potatoes and tomatoes in a baking dish with oil and pepper.",
      "Place kofta over the vegetables and add a splash of water.",
      "Bake at 200C until potatoes are tender and kofta are thoroughly cooked."
    ],
    chefTips: "Spiced kofta are cooked with vegetables in one dish rather than fried.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-maqluba-with-chicken-and-aubergine",
    title: "Maqluba with Chicken and Aubergine",  // Origin: Palestine and wider Levant
    time: "Serves 6",
    cost: 3.3,
    costPerServing: 0.55,
    image: "/recipes/wk-maqluba-with-chicken-and-aubergine.jpeg",
    category: "under2",
    tags: ["Middle Eastern - Levant"],
    cuisine: "Middle Eastern - Levant",
    ingredients: [
      "500g skinless chicken thighs",
      "300g brown rice",
      "1 aubergine, sliced",
      "1 cauliflower, in florets",
      "1 onion",
      "1 tsp ground allspice",
      "1/2 tsp ground cinnamon",
      "1/2 tsp turmeric",
      "1 tbsp rapeseed oil",
      "750ml low-salt stock",
      "Small pinch of salt"
    ],
    instructions: [
      "Bake aubergine and cauliflower with a little oil until coloured.",
      "Simmer chicken with onion, spices and stock until nearly cooked.",
      "Layer chicken and vegetables in a deep pan, cover with rinsed rice and measured stock.",
      "Cook until rice is tender, rest for 10 minutes, then carefully invert onto a platter."
    ],
    chefTips: "The dramatic inversion and layered rice, chicken and vegetables are integral to maqluba.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-fasolia--tomato-and-white-bean-stew",
    title: "Fasolia - Tomato and White Bean Stew",  // Origin: Levant
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-fasolia--tomato-and-white-bean-stew.jpeg",
    category: "under2",
    tags: ["Middle Eastern - Levant"],
    cuisine: "Middle Eastern - Levant",
    ingredients: [
      "480g cannellini beans",
      "1 onion, diced",
      "2 garlic cloves",
      "400g tinned chopped tomatoes",
      "1 tbsp tomato puree",
      "1 tsp olive oil",
      "1 tsp ground allspice",
      "Fresh coriander",
      "200g brown rice",
      "Black pepper",
      "Small pinch of salt"
    ],
    instructions: [
      "Cook the rice.",
      "Soften onion in oil, then add garlic and allspice.",
      "Add tomatoes, puree and beans; simmer until rich and thick.",
      "Season and finish with coriander; serve with rice."
    ],
    chefTips: "A simple tomato-braised bean dish built around economical pantry ingredients.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "10g"
    }
  },
  {
    id: "wk-jollof-rice",
    title: "Jollof Rice",  // Origin: Nigeria/Ghana and wider West Africa
    time: "Serves 6",
    cost: 3.3,
    costPerServing: 0.55,
    image: "/recipes/wk-jollof-rice.jpeg",
    category: "under2",
    tags: ["West African"],
    cuisine: "West African",
    ingredients: [
      "350g brown rice",
      "1 onion, chopped",
      "2 peppers",
      "400g tinned chopped tomatoes",
      "2 tbsp tomato puree",
      "1 Scotch bonnet",
      "1 tsp dried thyme",
      "1 tsp curry powder",
      "2 bay leaves",
      "750ml low-salt stock",
      "1 tbsp rapeseed oil",
      "Small pinch of salt"
    ],
    instructions: [
      "Blend tomatoes, peppers, half the onion and chilli.",
      "Soften remaining onion in oil; add puree, thyme, curry powder and bay.",
      "Cook the blended sauce until reduced and the raw tomato flavour has gone.",
      "Add rice and stock, cover tightly and cook gently until tender."
    ],
    chefTips: "A well-reduced pepper-tomato base is essential; regional versions and preferences vary.",
    nutrition: {
      calories: 240,
      protein: "12g",
      carbs: "30g",
      fiber: "9g"
    }
  },
  {
    id: "wk-red-red-with-baked-plantain",
    title: "Red Red with Baked Plantain",  // Origin: Ghana
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-red-red-with-baked-plantain.jpeg",
    category: "under2",
    tags: ["West African"],
    cuisine: "West African",
    ingredients: [
      "480g black-eyed beans",
      "1 onion, sliced",
      "400g tinned chopped tomatoes",
      "1 tbsp tomato puree",
      "1 Scotch bonnet",
      "1 tsp fresh ginger",
      "1 tbsp red palm oil",
      "2 ripe plantains",
      "Small pinch of salt"
    ],
    instructions: [
      "Bake sliced plantain at 200C until golden.",
      "Cook onion in palm oil, then add ginger, chilli, tomatoes and puree.",
      "Cook until the sauce is rich and the oil begins to show.",
      "Add beans, simmer, season and serve with plantain."
    ],
    chefTips: "Black-eyed beans, tomato stew and ripe plantain form the classic Ghanaian combination.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "9g"
    }
  },
  {
    id: "wk-nigerian-chicken-stew",
    title: "Nigerian Chicken Stew",  // Origin: Nigeria
    time: "Serves 6",
    cost: 3.3,
    costPerServing: 0.55,
    image: "/recipes/wk-nigerian-chicken-stew.jpeg",
    category: "under2",
    tags: ["West African"],
    cuisine: "West African",
    ingredients: [
      "700g skinless chicken thighs",
      "2 peppers",
      "400g tinned chopped tomatoes",
      "2 onions",
      "2 tbsp tomato puree",
      "1 Scotch bonnet",
      "1 tsp dried thyme",
      "1 tsp curry powder",
      "2 bay leaves",
      "1 tbsp rapeseed oil",
      "Small pinch of salt"
    ],
    instructions: [
      "Blend peppers, tomatoes, one onion and chilli; cook down until concentrated.",
      "Season and bake the chicken until thoroughly cooked.",
      "Soften remaining onion in oil; add puree, thyme, curry powder and bay.",
      "Add the reduced pepper mixture and chicken; simmer until the stew is rich."
    ],
    chefTips: "Reducing the blended pepper base thoroughly creates the characteristic depth.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "9g"
    }
  },
  {
    id: "wk-groundnut-stew",
    title: "Groundnut Stew",  // Origin: West Africa
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-groundnut-stew.jpeg",
    category: "under2",
    tags: ["West African"],
    cuisine: "West African",
    ingredients: [
      "400g chickpeas",
      "1 onion, diced",
      "1 sweet potato, cubed",
      "400g tinned chopped tomatoes",
      "3 tbsp unsweetened peanut butter",
      "1 tbsp tomato puree",
      "1 tsp fresh ginger",
      "1 garlic clove",
      "1/2 tsp chilli powder",
      "100g spinach",
      "750ml low-salt vegetable stock"
    ],
    instructions: [
      "Soften onion, ginger and garlic with a splash of stock.",
      "Add sweet potato, tomatoes, puree and remaining stock; simmer until nearly tender.",
      "Whisk peanut butter with hot liquid from the pan and stir it back in.",
      "Add chickpeas and spinach and simmer until thick."
    ],
    chefTips: "Groundnuts give the stew body and richness; this plant-based version uses chickpeas.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "10g"
    }
  },
  {
    id: "wk-chicken-yassa",
    title: "Chicken Yassa",  // Origin: Senegal and The Gambia
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-chicken-yassa.jpeg",
    category: "under2",
    tags: ["West African"],
    cuisine: "West African",
    ingredients: [
      "600g skinless chicken thighs",
      "5 onions, thinly sliced",
      "3 lemons",
      "2 garlic cloves",
      "1 Scotch bonnet",
      "1 tbsp Dijon mustard",
      "1 tbsp rapeseed oil",
      "1 bay leaf",
      "Black pepper",
      "Small pinch of salt",
      "200g brown rice"
    ],
    instructions: [
      "Marinate chicken with lemon, garlic, mustard, chilli, pepper and salt.",
      "Remove chicken and brown or grill it; reserve the marinade.",
      "Slowly soften the onions in oil, then add marinade and bay and simmer.",
      "Return chicken, cook thoroughly and serve with rice."
    ],
    chefTips: "The generous onion and sharp lemon-mustard marinade define this Senegambian dish.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-chicken-tinga",
    title: "Chicken Tinga",  // Origin: Puebla, Mexico
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-chicken-tinga.jpeg",
    category: "under2",
    tags: ["Mexican"],
    cuisine: "Mexican",
    ingredients: [
      "500g cooked shredded chicken",
      "1 onion, sliced",
      "400g tinned chopped tomatoes",
      "1-2 chipotle chillies in adobo",
      "1 garlic clove",
      "1 tsp Mexican oregano",
      "1 tsp rapeseed oil",
      "8 corn tortillas",
      "1 lime",
      "Small pinch of salt"
    ],
    instructions: [
      "Blend tomatoes, chipotle, garlic and oregano.",
      "Soften onion in oil until translucent.",
      "Add the tomato mixture and simmer until reduced.",
      "Add chicken, heat thoroughly and serve in warm corn tortillas with lime."
    ],
    chefTips: "Chipotle, tomato, onion and shredded chicken create the traditional smoky tinga profile.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-picadillo-mexicano",
    title: "Picadillo Mexicano",  // Origin: Mexico
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-picadillo-mexicano.jpeg",
    category: "under2",
    tags: ["Mexican"],
    cuisine: "Mexican",
    ingredients: [
      "400g 5% fat beef mince",
      "1 onion, diced",
      "2 fresh tomatoes, chopped",
      "2 white potatoes, diced",
      "1 carrot, diced",
      "100g peas",
      "1 garlic clove",
      "1 tsp ground cumin",
      "1 tsp Mexican oregano",
      "1 tsp rapeseed oil",
      "Small pinch of salt"
    ],
    instructions: [
      "Brown the beef in oil, then add onion and garlic.",
      "Add tomatoes and cook until they form a sauce.",
      "Add potato, carrot, cumin, oregano and a little water.",
      "Simmer until tender, add peas and season."
    ],
    chefTips: "This everyday Mexican mince dish varies by household; potato, carrot and tomato are common.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "8g"
    }
  },
  {
    id: "wk-enfrijoladas",
    title: "Enfrijoladas",  // Origin: Mexico
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-enfrijoladasbb.jpeg",
    category: "under2",
    tags: ["Mexican"],
    cuisine: "Mexican",
    ingredients: [
      "480g black or kidney beans",
      "12 corn tortillas",
      "1 onion, divided",
      "1 garlic clove",
      "500ml low-salt vegetable stock",
      "1 tsp rapeseed oil",
      "100g queso fresco",
      "Fresh coriander",
      "1 lime",
      "Small pinch of salt"
    ],
    instructions: [
      "Blend beans with half the onion, garlic and enough stock to make a smooth sauce.",
      "Simmer the bean sauce until it coats a spoon.",
      "Warm tortillas, dip each in sauce and fold onto plates.",
      "Spoon over more sauce and top with onion, queso fresco, coriander and lime."
    ],
    chefTips: "The bean sauce is the defining element; tortillas are dipped rather than covered with a generic chilli.",
    nutrition: {
      calories: 278,
      protein: "18g",
      carbs: "30g",
      fiber: "6g"
    }
  },
  {
    id: "wk-calabacitas-con-frijoles",
    title: "Calabacitas con Frijoles",  // Origin: Mexico
    time: "Serves 4",
    cost: 2.2,
    costPerServing: 0.55,
    image: "/recipes/wk-calabacitas-con-frijoles.jpeg",
    category: "under2",
    tags: ["Mexican"],
    cuisine: "Mexican",
    ingredients: [
      "3 courgettes, diced",
      "240g kidney or black beans",
      "1 onion, diced",
      "2 fresh tomatoes, chopped",
      "150g sweetcorn",
      "1 poblano or green pepper, chopped",
      "1 garlic clove",
      "1 tsp rapeseed oil",
      "Fresh coriander",
      "1 lime",
      "Small pinch of salt"
    ],
    instructions: [
      "Soften onion and pepper in oil; add garlic.",
      "Add tomatoes and cook until juicy.",
      "Add courgettes, sweetcorn and beans and cook until just tender.",
      "Season and finish with coriander and lime; serve with corn tortillas if desired."
    ],
    chefTips: "Courgette, corn, chilli and beans reflect a familiar Mexican vegetable combination.",
    nutrition: {
      calories: 238,
      protein: "18g",
      carbs: "20g",
      fiber: "10g"
    }
  },
  {
    id: "wk-albondigas-en-caldillo",
    title: "Albondigas en Caldillo",  // Origin: Mexico
    time: "Serves 6",
    cost: 3.3,
    costPerServing: 0.55,
    image: "/recipes/wk-albondigas-en-caldillo.jpeg",
    category: "under2",
    tags: ["Mexican"],
    cuisine: "Mexican",
    ingredients: [
      "500g 5% fat beef mince",
      "1 egg",
      "50g uncooked brown rice",
      "1 onion, divided",
      "2 garlic cloves",
      "Fresh coriander",
      "400g tinned chopped tomatoes",
      "2 carrots, sliced",
      "2 white potatoes, cubed",
      "1 chipotle chilli, optional",
      "1 litre low-salt stock",
      "Small pinch of salt"
    ],
    instructions: [
      "Mix beef with egg, rice, half the onion, one garlic clove and coriander; shape into small meatballs.",
      "Blend tomatoes with remaining onion, garlic and chipotle.",
      "Simmer the tomato mixture with stock, carrots and potatoes.",
      "Add meatballs gently and simmer until meat and rice are thoroughly cooked."
    ],
    chefTips: "Rice inside the meatballs and a light tomato broth distinguish this Mexican family dish.",
    nutrition: {
      calories: 355,
      protein: "24g",
      carbs: "40g",
      fiber: "8g"
    }
  },
];

export const mockStyles = [
  {
    nickname: '패션러버',
    title: '가을 데일리룩 🍁',
    content: '따뜻한 색감으로 코디했어요!',
    password: '12341234',
    categories: {
      top: { name: '니트 스웨터', brand: 'Uniqlo', price: 39000 },
      bottom: { name: '데님 팬츠', brand: 'Levi’s', price: 89000 },
      outer: { name: '트렌치코트', brand: 'Musinsa', price: 129000 },
      dress: null,
      shoes: { name: '첼시 부츠', brand: 'Dr. Martens', price: 189000 },
      bag: { name: '숄더백', brand: 'Guess', price: 59000 },
      accessory: { name: '실버 이어링', brand: 'Pandora', price: 35000 },
    },
    tags: ['가을', '데일리', '심플'],
    imageUrls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],

    // ✅ 큐레이팅 추가
    curatings: [
      {
        nickname: '패션평론가',
        content: '따뜻한 색감이 정말 가을에 잘 어울려요 🍂',
        password: '1111',
        trendy: 4,
        personality: 5,
        practicality: 4,
        costEffectiveness: 3,
      },
      {
        nickname: '감성러',
        content: '컬러 조합이 너무 부드럽네요 ☕',
        password: '2222',
        trendy: 3,
        personality: 5,
        practicality: 4,
        costEffectiveness: 5,
      },
    ],
  },
  {
    nickname: '스트릿소년',
    title: '스트릿 감성 룩 😎',
    content: '오버핏 후드랑 조거팬츠로 꾸안꾸!',
    password: 'abcd1234',
    categories: {
      top: { name: '후드티', brand: 'Nike', price: 69000 },
      bottom: { name: '조거 팬츠', brand: 'Adidas', price: 59000 },
      outer: null,
      dress: null,
      shoes: { name: '에어포스', brand: 'Nike', price: 129000 },
      bag: { name: '백팩', brand: 'Supreme', price: 199000 },
      accessory: { name: '비니', brand: 'Carhartt', price: 35000 },
    },
    tags: ['스트릿', '남친룩'],
    imageUrls: ['https://example.com/street1.jpg', 'https://example.com/street2.jpg'],

    // ✅ 큐레이팅 추가
    curatings: [
      {
        nickname: '트렌드헌터',
        content: '스트릿 무드 완벽 😎',
        password: '3333',
        trendy: 5,
        personality: 4,
        practicality: 5,
        costEffectiveness: 4,
      },
    ],
  },
];

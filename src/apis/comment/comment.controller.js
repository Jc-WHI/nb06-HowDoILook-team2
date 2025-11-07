import prisma from '../../prismaClient.js';

//comment create =====
const creatComment = async (req, res) => {
  try {
    const { curationId } = req.params; //1, 2, 3
    const { content, password } = req.body; // 내용, 비밀번호비번비번

    //curatingData = 특정 curating(Id)이 등록된 스타일 게시글의 정보를 받아온다.
    const curatingData = await prisma.curating.findUnique({
      where: { id: parseInt(curationId) },
      include: { style: true },
    });

    //큐레이팅 데이터가 없거나, 포함된 스타일 게시글을 못받아 온다면, return 404
    if (!curatingData || !curatingData.style) {
      return res.status(404).send({ message: '요청하신 데이터를 찾을 수 없습니다 :(' });
    }

    //큐레이팅데이터에.받아온스타일정보중에.패스워드를 stylePassword에 적용
    const stylePassword = curatingData.style.password;

    // if 입력된 password === stylePassword(style에 등록된 password) 일치하면
    if (password === stylePassword) {
      const replyData = await prisma.comment.create({
        data: {
          content,
          curating: { connect: { id: parseInt(curationId) } },
        },
        select: {
          id: true,
          nickname: true,
          content: true,
          createdAt: true,
        },
      });
      res.status(201).json({ message: '답글이 등록되었습니다.', data: replyData });
    } else {
      //비번이 다르다면
      return res.status(403).json({ message: '스타일 비밀번호와 일치하지 않습니다.' });
    }
  } catch (err) {
    return console.error('에러코드', err);
  } finally {
    console.log('====== 답글 등록 테스트 종료 ======');
  }
};

export { creatComment };

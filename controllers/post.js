const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  const { title, content, slug, image, published, categoryId, tags } = req.body;
  try {
    const newPost = await prisma.post.create({
      // Crea un nuovo post nel database utilizzando Prisma
      data: {
        title,
        content,
        slug,
        image,
        published,
        category: { connect: { id: categoryId } },
        tags: { connect: tags.map((tagId) => ({ id: tagId })) },
      },
      
    });
    res.status(201).json(newPost); // Stato 201 (Created) e restituisce il nuovo post creato
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Impossibile creare il post', details: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
      },
    });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: 'Post non trovato' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Impossibile recuperare il post',
      details: error.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  const { published, keyword, page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    let where = { published: true }; // Recupera solo i post pubblicati
    if (keyword) {
      // Se presente una parola chiave nella ricerca, aggiunge condizione OR per cercare la parola chiave nel titolo o nel contenuto del post.
      where.OR = [
        { title: { contains: keyword, insensitive: true } },
        { content: { contains: keyword, insensitive: true } },
      ];
    }

    const totalCount = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);

    const posts = await prisma.post.findMany({
      // Recupera post nel database e include le categorie e i tag associati a ciascun post
      where,
      include: {
        category: true,
        tags: true,
      },
      skip,
      take: parseInt(pageSize),
    });

    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      posts,
    }); // Stato 200 (OK) e restituisce tutti i post recuperati con le informazioni di paginazione
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Impossibile recuperare i post', details: error.message });
  }
};

exports.updatePost = async (req, res) => {
  const { slug } = req.params;
  const { title, content, published, categoryId, tags } = req.body;
  try {
    const updatedPost = await prisma.post.update({
      // Aggiorna un post nel database
      where: { slug },
      data: {
        title,
        content,
        published,
        categoryId,
        tags: { set: tags.map((tagId) => ({ id: tagId })) },
      },
    });
    res.status(200).json(updatedPost); // Stato 200 (OK) e restituisce il post aggiornato
  } catch (error) {
    res.status(500).json({
      error: 'Impossibile aggiornare il post',
      details: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  const { slug } = req.params;
  try {
    await prisma.post.delete({
      // Elimina un post dal database
      where: { slug },
    });
    res.status(204).send(); // Stato 204 (No Content) per indicare che il post è stato eliminato con successo
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Impossibile eliminare il post', details: error.message });
  }
};

import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetListBlogDto } from './dto/get-list-blog.dto';
import { ESort } from 'src/_core/constant/enum.constant';
import { FollowBlogDto } from './dto/follow-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async createBlog(userId: number, data: CreateBlogDto) {
    const { title, image, content } = data;

    return await this.prisma.blog.create({
      data: {
        creatorId: userId,
        title,
        image,
        content,
      },
    });
  }

  async getDetail(id: number, userId?: number) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        creator: {
          select: {
            company: {
              select: {
                id: true,
                name: true,
                avatar: true,
                primaryAddress: true,
                sizeType: true,
              },
            },
          },
        },
        ...(userId && {
          userFollowBlogs: {
            where: {
              userId,
            },
          },
        }),
        _count: {
          select: {
            userFollowBlogs: true,
          },
        },
      },
    });

    if (!blog) {
      throw new CommonException(MessageResponse.BLOG.NOT_FOUND);
    }

    await this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        totalViews: blog.totalViews + 1,
      },
    });

    if (blog.userFollowBlogs?.length > 0) {
      blog['isFollow'] = true;
    } else {
      blog['isFollow'] = false;
    }
    delete blog.userFollowBlogs;

    const company = blog.creator.company;
    delete blog.creator;
    blog['company'] = company;

    blog['totalFollow'] = blog._count.userFollowBlogs;
    delete blog._count.userFollowBlogs;

    return blog;
  }

  async deleteBlog(userId: number, id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
        creatorId: userId,
      },
    });

    if (!blog) {
      throw new CommonException(MessageResponse.BLOG.NOT_FOUND);
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.userFollowBlog.deleteMany({
          where: {
            blogId: id,
          },
        });
        await tx.blog.delete({
          where: { id },
        });
      });
    } catch (error: any) {
      throw error;
    }

    return;
  }

  async updateBlog(userId: number, id: number, data: UpdateBlogDto) {
    const { title, image, content } = data;

    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
        creatorId: userId,
      },
    });

    if (!blog) {
      throw new CommonException(MessageResponse.BLOG.NOT_FOUND);
    }

    const blogUpdated = await this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        title,
        image,
        content,
      },
    });

    return blogUpdated;
  }

  async getListBlog(query: GetListBlogDto, userId?: number) {
    const { creatorId, limit, page, sortCreatedAt, filter, companyId } = query;

    const whereCondition = {
      creatorId,
      creator: {
        companyId,
      },
      ...(filter && {
        OR: [
          {
            title: {
              search: filter,
            },
          },
          {
            content: {
              search: filter,
            },
          },
        ],
      }),
    };

    const totalBlog = await this.prisma.blog.count({
      where: whereCondition,
    });

    let orderBy: object;

    if (filter) {
      orderBy = [
        {
          _relevance: {
            fields: ['title', 'content'],
            search: filter,
            sort: ESort.DESC,
          },
        },
        {
          createdAt: sortCreatedAt || ESort.DESC,
        },
      ];
    } else {
      orderBy = {
        createdAt: sortCreatedAt || ESort.DESC,
      };
    }

    const listBlog = await this.prisma.blog.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      select: {
        id: true,
        title: true,
        createdAt: true,
        image: true,
        content: true,
        creator: {
          select: {
            company: {
              select: {
                id: true,
                name: true,
                avatar: true,
                primaryAddress: true,
                sizeType: true,
              },
            },
          },
        },
        ...(userId && {
          userFollowBlogs: {
            where: {
              userId,
            },
          },
        }),
        _count: {
          select: {
            userFollowBlogs: true,
          },
        },
      },
    });

    listBlog.forEach((blog) => {
      blog['totalFollow'] = blog._count.userFollowBlogs;
      delete blog._count.userFollowBlogs;

      const company = blog.creator.company;
      delete blog.creator;
      blog['company'] = company;

      if (blog.userFollowBlogs?.length > 0) {
        blog['isFollow'] = true;
      } else {
        blog['isFollow'] = false;
      }
      delete blog.userFollowBlogs;
    });

    return {
      meta: {
        pagination: {
          page: page,
          pageSize: limit,
          totalPage: Math.ceil(totalBlog / limit),
          totalItem: totalBlog,
        },
      },
      data: listBlog,
    };
  }

  async userFollowBlog(userId: number, blogId: number, data: FollowBlogDto) {
    const { isFavorite } = data;

    const blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blog) {
      throw new CommonException(MessageResponse.BLOG.NOT_FOUND);
    }

    const userFollowBlog = await this.prisma.userFollowBlog.findUnique({
      where: {
        blogId_userId: {
          userId,
          blogId,
        },
      },
    });

    if (isFavorite) {
      if (userFollowBlog) {
        throw new CommonException(MessageResponse.USER_FOLLOW_BLOG.FOLLOWED);
      }

      await this.prisma.userFollowBlog.create({
        data: {
          userId,
          blogId,
        },
      });
    } else {
      if (!userFollowBlog) {
        throw new CommonException(MessageResponse.USER_FOLLOW_BLOG.NOT_FOUND);
      }

      await this.prisma.userFollowBlog.delete({
        where: {
          blogId_userId: {
            userId,
            blogId,
          },
        },
      });
    }
  }
}

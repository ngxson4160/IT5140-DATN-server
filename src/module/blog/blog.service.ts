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

  async getDetail(id: number) {
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

    const totalFollow = await this.prisma.userFollowBlog.count({
      where: {
        blogId: id,
      },
    });

    const company = blog.creator.company;
    delete blog.creator;
    blog['company'] = company;
    blog['totalFollow'] = totalFollow;

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

    await this.prisma.blog.delete({
      where: {
        id,
      },
    });
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

  async getListBlog(query: GetListBlogDto) {
    const { creatorId, limit, page, sortCreatedAt, filter, companyId } = query;

    const totalBlog = await this.prisma.blog.count({
      where: {
        title: {
          contains: filter,
        },
        creatorId,
        creator: {
          companyId,
        },
      },
    });

    const listBlog = await this.prisma.blog.findMany({
      where: {
        title: {
          contains: filter,
        },
        creatorId,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: sortCreatedAt || ESort.DESC,
        },
      ],
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
        _count: {
          select: {
            userFollowBlogs: true,
          },
        },
      },
    });

    listBlog.forEach((blog) => {
      const company = blog.creator.company;
      delete blog.creator;
      blog['company'] = company;
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

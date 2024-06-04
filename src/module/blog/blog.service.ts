import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonException } from 'src/_core/middleware/filter/exception.filter';
import { MessageResponse } from 'src/_core/constant/message-response.constant';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetListBlogDto } from './dto/get-list-blog.dto';
import { ESort } from 'src/_core/constant/enum.constant';

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

    const company = blog.creator.company;
    delete blog.creator;
    blog['company'] = company;

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
    const { creatorId, limit, page, sortCreatedAt, filter } = query;

    const totalBlog = await this.prisma.blog.count({
      where: {
        title: {
          contains: filter,
        },
        creatorId,
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
}

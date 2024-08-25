const prisma = require('../prismaClient');

async function search_users(username, currentUser, cursor) {
    console.log("Current User: ", currentUser)
    const users = prisma.user.findMany({
        where: {
            username: {
                startsWith: username,
                mode: 'insensitive'
            },
            id: {
                not: currentUser
            }
        },
        orderBy: {
            username: 'asc'
        },
        take: 10,
        ...(cursor && {
            cursor: {
                username: cursor
            },
            skip: 1
        }),
        select: {
            id: true,
            username: true
        }
    })

    return users
}

async function create_group(users, name) {
    const newGroup = await prisma.group.create({
        data: {
            name,
            users
        }
    })

    await prisma.user.updateMany({
        where: {
            id: {
                in: users
            }
        },
        data: {
            groups: {
                push: newGroup.id
            }
        }
    })

    return newGroup
}

async function get_user_groups(userId) {
    const groups = await prisma.group.findMany({
        where: {
            users: {
                has: userId
            }
        },
        select: {
            id: true,
            name: true
        }
    })

    return groups
}

module.exports = {
    search_users,
    create_group,
    get_user_groups
}
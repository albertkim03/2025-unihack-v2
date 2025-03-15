// @ts-nocheck

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ClassroomsClient } from "@/components/classrooms-client"

export default async function ClassroomsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return <div>Please log in to view your classrooms</div>
  }

  // Get classrooms where the user is the owner
  const ownedClassrooms = await prisma.classroom.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      _count: {
        select: {
          members: true,
          tests: true,
        },
      },
      tests: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  // Get classrooms where the user is a member
  const memberClassrooms = await prisma.classroom.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      owner: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      _count: {
        select: {
          members: true,
          tests: true,
        },
      },
      tests: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  // Format the data for display
  const formatClassroom = (classroom, isOwned = true) => {
    return {
      id: classroom.id,
      name: classroom.name,
      description: classroom.description || (isOwned ? "Your classroom" : "Classroom you're enrolled in"),
      students: classroom._count.members,
      tests: classroom._count.tests,
      recent: classroom.tests.length > 0 ? classroom.tests[0].title : "No tests yet",
      owner: isOwned ? null : `${classroom.owner.firstName} ${classroom.owner.lastName}`,
    }
  }

  const formattedOwnedClassrooms = ownedClassrooms.map((c) => formatClassroom(c, true))
  const formattedMemberClassrooms = memberClassrooms.map((c) => formatClassroom(c, false))

  // Combine all classrooms for the client component
  const allClassrooms = {
    owned: formattedOwnedClassrooms,
    member: formattedMemberClassrooms,
  }

  return <ClassroomsClient initialClassrooms={allClassrooms} />
}


import path from "path";
import { Banner } from "@/components/Banner";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import { ImageContainer } from "@/components/ImageContainer";
import Image from "next/image";

import type { articleElem } from "@/components/ContentContainer";

const base = "/projects/RRT";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "RRT",
    content: (
      <div>
        <h2>Path Planning</h2>
        <p>
          RRT represents a class of methods (Rapidly exploring Random Trees) to
          finding an optimal path within a given free space from one point to
          another. It is often used in planning robotic motion constrained
          motion problems due to its flexibility.
        </p>
        <p>
          I started the project as an application to a club, but worked on it
          after as a passion project, and it provided a nice introduction to
          researching and implementing algorithms.
        </p>
        <p>
          The core idea is to sample the free space and attempt to grow the tree
          from the root (starting point) to the sampled point by a chosen step
          size. Over many iterations, the tree will flood the free space and a
          solution will be found.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, `RRT_extend.svg`)}
            width="566"
            height="340"
            alt="rrt_extend"
          />
        </ImageContainer>
        <p>
          The algorithm makes heavy use of finding the nearest neighbor to the
          sampled point, and so spatial indexing is often used as a speed up.
          There are many trees that can be used for indexing, but I chose to
          implement RTrees due to its flexibility, mainly, its ability to handle
          objects outside of just points. This becomes handy when dealing with
          meshes for fast obstacle collision detection.
        </p>
        <ImageContainer className="w-[30rem]">
          <Image
            src={path.join(mediaBase, `RTree_Visualization_3D.png`)}
            alt="RTree Wikipedia"
            width="800"
            height="800"
          />
        </ImageContainer>
        <p>
          The simple implementation is not very effective however, as the path
          is not optimal in terms of length. It is also not effective in
          maneuvering small spaces:
        </p>
        <ImageContainer columns={2} className="w-[40rem]">
          <Image
            src={path.join(mediaBase, `rrt_basic.png`)}
            alt="rrt"
            loading="lazy"
            width="1650"
            height="1680"
          />
          <Image
            src={path.join(mediaBase, `rrt_maze.png`)}
            alt="rrt_maze"
            loading="lazy"
            width="1730"
            height="1740"
          />
        </ImageContainer>
        <p>
          As it fails to find the optimal path in a maze. One of these problems
          can be tackled with rrt*, a variant which adjusts the wiring of the
          new node to the tree. Rather than selecting the closest neighbor to
          the sampled node, we select the tree node in a neighborhood of the
          nearest neighbor. The cost function will determing the parent node,
          and the metric used is the distance from the sampled node to the root
          of the tree,
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, `RRT_star_intro.svg`)}
            alt="rrt_rewire"
            loading="lazy"
            width="1650"
            height="1680"
          />
        </ImageContainer>
        <p>
          We can see that the distance from the root to the leaf nodes are
          shortened substantially.
        </p>
        <ImageContainer columns={2} className="w-[40rem]">
          <Image
            src={path.join(mediaBase, `rrt_star_rom.png`)}
            alt="rrt star"
            loading="lazy"
            width="1430"
            height="1430"
          />
          <Image
            src={path.join(mediaBase, `rrt_star_maze.png`)}
            alt="rrt star"
            loading="lazy"
            width="1550"
            height="1600"
          />
        </ImageContainer>
        <p>
          There are many other variants, and here is a list and some details of
          the ones I implemented:
        </p>
        <aside>
          <details>
            <summary>RRT Connect</summary>
            <p>
              A bidirectional form of rrt where two trees are grown, one from
              the start and one from the goal point.
            </p>
          </details>
          <details>
            <summary>Informed RRT*</summary>
            <p>
              After the initial RRT* solution has been found, sampling is
              restrained to an ellipsoid, for faster convergence to the
              solution.
            </p>
          </details>
          <details>
            <summary>Quick RRT</summary>
            <p>
              Similar to RRT* but we also consider the ancestors in the rewiring
              method of RRT*. By doing this, we decrease the depth of the tree,
              making the path more linear.
            </p>
          </details>
          <details>
            <summary>EP RRT</summary>
            <p>
              Similar to Informed RRT* but we sample within a given radius to
              our solution path for faster convergence to the solution.
            </p>
          </details>
          <details>
            <summary>BTO RRT</summary>
            <p>
              This makes two modifications. One is the connect heuristic, branch
              from RRT Connect. Rather than having both trees grow to each
              other&apos;s roots, one tree grows to the other&apos;s root, while
              the other grows towards the most recently appended node, which
              acts sort of like a flag.
            </p>
            <p>
              The second modification is the post processing of the path. The
              path is downsampled to get a tighter solution, and interpolated
              with a parametric spline for path smoothing. We then clamp our
              path with keypoints to ensure that no collision is added during
              the interpolation.
            </p>
          </details>
        </aside>
        <p>
          Overall, it was a very fun and rewarding project to work on. Here are
          some cool animations of visualizing the solution path.
        </p>

        <ImageContainer columns={2} className="w-[40rem]">
          <video autoPlay muted loop playsInline>
            <source
              src={path.join(mediaBase, `bto_maze_tracked.mp4`)}
              type="video/mp4"
            />
          </video>
          <video autoPlay muted loop playsInline>
            <source
              src={path.join(mediaBase, `bto_rom_tracked.mp4`)}
              type="video/mp4"
            />
          </video>
        </ImageContainer>
        <p>
          I also built a GUI for visualization of the solution path, obstacles,
          and underlying data structures, which can be found on Github.
        </p>
        <ImageContainer columns={2} className="w-[40rem]">
          <video autoPlay muted loop playsInline>
            <source
              src={path.join(mediaBase, `bto_maze_visual.mp4`)}
              type="video/mp4"
            />
          </video>
          <video autoPlay muted loop playsInline>
            <source
              src={path.join(mediaBase, `rrt_connect_visual.mp4`)}
              type="video/mp4"
            />
          </video>
        </ImageContainer>
      </div>
    ),
  },
];

export default async function Page() {
  return (
    <div>
      <Banner>
        <h1> Rapidly Exploring Random Trees</h1>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article) => (
              <Section key={article.id}>
                <Article id={article.id} link={article.link}>
                  {article.content}
                </Article>
              </Section>
            ))}
          </SectionContainer>
        </MainContainer>
      </PageContainer>
    </div>
  );
}

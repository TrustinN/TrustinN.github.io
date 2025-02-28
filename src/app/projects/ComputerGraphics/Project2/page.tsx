"use client";

import path from "path";
import { Banner } from "@/components/Banner";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import { ImageContainer, Figure } from "@/components/ImageContainer";
import Image from "next/image";
import { MathJax } from "better-react-mathjax";
import { Sidebar } from "@/components/Sidebar";

import type { articleElem } from "@/components/ContentContainer";

const base = "/projects/ComputerGraphics/Project2";
const mediaBase = path.join(base, "media");
const imgWidth = 1906;
const imgHeight = 1256;

const pageContent: articleElem[] = [
  {
    id: "Overview",
    content: (
      <div>
        <h2> Overview </h2>
        <p>
          In this project, we explore ways of working with bezier lines/curves
          along with understanding the data structures needed to perform mesh
          operations.
        </p>
      </div>
    ),
  },
  {
    id: "Bezier Curves",
    content: (
      <div>
        <h2>Bezier Curves</h2>
        <p>
          In Casteljau&apos;s algorithm, we compute a series of lerps until the
          number of control points goes down to 1. This last point will be a
          point on the curve. This gives a recursive/iterative algorithm for
          computing the point. We are given a vector of points and compute a
          lerp on that vector to get a new vector of control points, repeating
          until our final vector has 1 point. The{" "}
          <MathJax inline={true}>{"\\(t\\)"}</MathJax> parameter we use for
          interpolation remains constant for a given point we want to compute on
          the curve. The images below illustrate the steps for computing the
          Bezier curve given 6 control points. Hover over the images to zoom in:
        </p>
        <ImageContainer columns={3}>
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const imagePath = path.join(mediaBase, `part1/mybz${num}.png`);
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imagePath}
                  alt={`Bezier curve ${num} step Casteljau`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> Step {num} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p>
          And here is an example where we moved a control point and set{" "}
          <MathJax inline={true}>{"\\(t\\)"}</MathJax> to a new value.
        </p>
        <ImageContainer className={"w-[35rem]"}>
          <Image
            src={path.join(mediaBase, "part1/mybzmodified.png")}
            alt={`Bezier curve modified and scrolled`}
            width={imgWidth}
            height={imgHeight}
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Bezier Surfaces",
    content: (
      <div>
        <h2> Bezier Surfaces</h2>
        <p>
          For bezier surfaces, we are now given a 2-d array of control points
          and two parametric variables,{" "}
          <MathJax inline={true}>{"\\(u, v\\)"}</MathJax> where{" "}
          <MathJax inline={true}>{"\\(u\\)"}</MathJax> represents the fraction
          along the <MathJax inline={true}>{"\\(x\\)"}</MathJax>-axis and{" "}
          <MathJax inline={true}>{"\\(v\\)"}</MathJax>, the{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax>-axis. To find a point on
          the curve given <MathJax inline={true}>{"\\(u, v\\)"}</MathJax>, we
          first collapse along one dimension by fully running Casteljau&apos;s
          algorithm for control points share the same{" "}
          <MathJax inline={true}>{"\\(x\\)"}</MathJax>-coordinate, using{" "}
          <MathJax inline={true}>{"\\(u\\)"}</MathJax>. Then we collaps along
          the second dimension, for ones sharing the same{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax>-coordinate, this time
          using <MathJax inline={true}>{"\\(v\\)"}</MathJax>. Teapot:
        </p>
        <ImageContainer className="w-[35rem]">
          <Image
            src={path.join(mediaBase, "part1/teapot.png")}
            alt="Teapot with bezier surface"
            width={imgWidth}
            height={imgHeight}
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Area Weighted Normals",
    content: (
      <div>
        <h2>Area Weighted Normals</h2>
        <p>
          To calculate the normals at the vertices of the mesh, we take a
          weighted sum of the normals associated with the faces around that
          vertex. To traverse the faces, we iterate around the half edges of the
          center vertex. Then we get the face associated with the halfedge:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "part2/face_iter.svg")}
            alt="Face iteration"
            width={300}
            height={150}
          />
        </ImageContainer>
        <p>
          To weigh the normals, we can take 1/2 of the norm of the cross product
          between two vectors of the face:
          <MathJax>
            {
              "\\begin{equation*} \\dfrac{1}{2} \\lVert v_{1} \\times v_{2} \\rVert \\end{equation*}"
            }
          </MathJax>
          and multiply scale the normal by this area. Finally, we take a linear
          combination:
          <MathJax>
            {
              "\\begin{equation*} v_{\\perp} = \\sum {Area}_{i} * n_{i} \\end{equation*}"
            }
          </MathJax>
          and normalize. Using the normals, we can have better shading by
          interpolating the shading value across each triangle surface (hover to
          zoom in):
        </p>
        <ImageContainer columns={2}>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "part2/flat_shading.png")}
              alt="Flat shading"
              width={imgWidth}
              height={imgHeight}
            />
            <figcaption>Flat Shading</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "part2/phong_shading.png")}
              alt="Interpolated phong shading"
              width={imgWidth}
              height={imgHeight}
            />
            <figcaption>Phong Shading</figcaption>
          </Figure>
        </ImageContainer>
        <p>
          A difference we see is that with the flat shading, the brightness
          across each triangle edge has a harsh transition, while for phong
          shading, it is much smoother.
        </p>
      </div>
    ),
  },
  {
    id: "Flipping Edges",
    content: (
      <div>
        <h2> Flipping Edges </h2>
        <p>
          Flipping edges is a local remeshing operation which does not require
          adding/deleting elements, shown below:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "part2/edge_flip.svg")}
            alt="Edge Flip"
            width={300}
            height={150}
          />
        </ImageContainer>
        <p>
          To implement this, we would do pointer reassignments to all elements
          involved in the component. Here is a list of all variables we need to
          change in each class:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "part2/updates.svg")}
            alt="Edge Flip"
            width={200}
            height={70}
          />
        </ImageContainer>
        <p>
          For halfedges, we can use the setNeighbors method to quickly update
          all its variables. Here is an application of the function on a couple
          of edges:
        </p>
        <ImageContainer className="w-[35rem]">
          <Image
            src={path.join(mediaBase, "part2/edge_flip.png")}
            alt="Edge Flip Teapot"
            width={imgWidth}
            height={imgHeight}
          />
        </ImageContainer>
        <p>
          For debugging, it was very helpful drawing out the operations and
          keeping track of all the variables I needed to update. Keeping the
          operations symmetrical between the halfedges that I flipped also
          proved to be convenient.
        </p>
      </div>
    ),
  },
  {
    id: "Splitting Edges",
    content: (
      <div>
        <h2> Splitting Edges </h2>
        <p>
          Splitting edges requires more pointer reassignments, and we would have
          to add more items to our mesh. Here is what the operation looks like:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "part2/edge_split.svg")}
            alt="Edge Split"
            width={300}
            height={150}
          />
        </ImageContainer>
        <p>
          We would have to create a new vertex bisecting the edge, three new
          edges to have 4 center edges, 6 new half edges for each of the 3
          edges, and 2 new faces. Here is an application of some splits on the
          teapot:
        </p>
        <ImageContainer className="w-[35rem]">
          <Image
            src={path.join(mediaBase, "part2/edge_split.png")}
            alt="Edge Split Teapot"
            width={imgWidth}
            height={imgHeight}
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Loop Subdivision",
    content: (
      <div>
        <h2> Loop Subdivision </h2>
        <p>
          Loop subdivision requires a combination of the previous two
          operations, the edge split and the edge flip. The process involves
          splitting all non boundary edges first, the flipping the added edges
          that connect an old vertex to a new vertex.
        </p>
        <ImageContainer className="w-[35rem]">
          <Image
            src={path.join(mediaBase, "part2/loop_subdivision.svg")}
            alt="Loop Subdivision"
            width={300}
            height={200}
          />
        </ImageContainer>
        <p>
          Following the diagram, the old edges are marked with green, with the
          new vertex from the split marked as red. We see that all edges that
          are green are split by the midpoint, and in the flip run, we fip all
          black edges that connect a black vertex to a red vertex
          (non-boundary). Now we can apply this subdivision method to some
          meshes:
        </p>
        <ImageContainer columns={3}>
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const imagePath = path.join(
              mediaBase,
              `part2/cube_loop_${num}.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imagePath}
                  alt={`Cube loop subdivision ${num}`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> Loop division #{num} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p>
          We notice that in subdivision, corners and edges are smoothed out,
          where the cube&apos;s features are rounded. Something we can do to
          reduce this effect is subdividing the edges such that the cube is made
          of more triangles. Because loop subdivision calculates the new
          position of each vertex by its neighbors, we want the neighboring
          vertices to be close:
        </p>
        <ImageContainer columns={3}>
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const imagePath = path.join(
              mediaBase,
              `part2/cube_refined_loop_${num}.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imagePath}
                  alt={`Cube loop subdivision ${num}`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> Loop division #{num} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p>
          And the result looks more like a cube. The way I also subdivided the
          edges of the cube gives symmetrical resulting mesh, because along the
          face of the cube, the diagonal splitting each face into triangles can
          go from top right to bottom left, or top left to bottom right. By
          adding diagonals such that the mesh is symmetrical, we get a
          symmetrical subdivision.
        </p>
        <p>Lastly, here is the algorithm applied to more interesting meshes:</p>
        <ImageContainer columns={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            let name = "cow";
            if (Math.floor((num - 1) / 3) == 1) {
              name = "bean";
            } else if (Math.floor((num - 1) / 3) == 2) {
              name = "beetle";
            }

            num = ((num - 1) % 3) + 1;
            const imagePath = path.join(
              mediaBase,
              `part2/${name}_loop_${num}.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imagePath}
                  alt={`${name} loop subdivision ${num}`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption>
                  {name} loop division #{num}{" "}
                </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Project 2: Bezier Curves and Mesh Operations</h1>
        <p>(https://trustinn.github.io/projects/ComputerGraphics/Project2)</p>
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
          <Sidebar ids={pageContent.map((content) => content.id)} />
        </MainContainer>
      </PageContainer>
    </div>
  );
}

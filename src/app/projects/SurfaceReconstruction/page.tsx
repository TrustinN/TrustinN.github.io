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
import type { articleElem } from "@/components/ContentContainer";
import { Sidebar } from "@/components/Sidebar";

import { ImageContainer } from "@/components/ImageContainer";
import Image from "next/image";
import { Figure } from "@/components/ImageContainer";
import { MathJax } from "better-react-mathjax";

const base = "/projects/SurfaceReconstruction/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Implicit and Explicit Reconstruction",
    content: (
      <div>
        <h2>Implicit and Explicit Reconstruction</h2>
        <p>
          In surface reconstruction, we attempt to recover a mesh that describes
          the surface from a point cloud. Reconstruction can be divided between
          two types, one is implicit and the other explicit.
        </p>
        <p>
          In explicit reconstruction, we construct the mesh through the physical
          properties of the mesh, for example, one method involves rolling a
          ball over the point cloud to define the surface. The crust method
          involves defining a Delaunay triangulation based on the spatial
          properties of the points.
        </p>
        <p>
          Implicit reconstruction on the other hand defines an implicit function
          over the 3d space. Through this, we can determine if a point in lies
          inside or outside of the mesh. A mesh generating algorithm such as
          marching cubes is then used to construct the triangles.
        </p>
        <ImageContainer className="w-[30rem]">
          <Image
            src={path.join(mediaBase, "/demo.gif")}
            alt="Sphere Reconstruction"
            width="720"
            height="720"
          />
        </ImageContainer>
        <p>
          In reconstruction, the aim is to build a watertight mesh that is
          robust to noise. Noise in this case are the inaccuracies in the point
          cloud that we are given arising from sampling error.
        </p>
      </div>
    ),
  },
  {
    id: "Hoppe's Algorithm",
    content: (
      <div>
        <h2>Hoppe&apos;s Algorithm</h2>
        <p>
          Hoppe&apos;s research paper proposes a method of obtaining the surface
          normals of an object, and later proposes a signed distance function
          that can be used to estimate the triangles computed during marching
          cubes.
        </p>
      </div>
    ),
  },
  {
    id: "Normal Approximation",
    content: (
      <div>
        <h2>Normal Approximation</h2>
        <p>
          To retrieve the normals, we utilize PCA (Principal Component Analysis)
          on a patch of points. This gives us vectors describing the orientation
          of the patch, and subsequently the vector of smallest magnitude is the
          normal to the surface:
        </p>
        <ImageContainer className="w-[30rem]">
          <Image
            src={path.join(mediaBase, "/pca.png")}
            alt="PCA"
            width="1920"
            height="1920"
          />
        </ImageContainer>
        <p>
          The smallest vector can either be pointing towards the inside of the
          object or outside, so to fix the traversal, we construct a Riemannian
          Graph (all vertices connected to their 15 closest neighbors) and
          decorate it with a Euclidean MST to ensure we can traverse all
          vertices. The traversal order is then decided by the mst with the
          weight function:{" "}
          <MathJax inline={true}>
            {
              "\\begin{equation*} w(u, v) = 1 - \\lvert u.N \\cdot v.N \\rvert \\end{equation*}"
            }
          </MathJax>{" "}
          which is the dot product between their normals. This is because if we
          consider two points very close to each other on a mesh surface, their
          normals will approximately be parallel. Therefore, the given weight
          function assigns a small weight to edges that join parallel normals.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/orient.svg")}
            alt="Orient Normals"
            width="300"
            height="200"
          />
        </ImageContainer>
        <p>
          This image shows the input normals, with incorrectly oriented normals
          in red. The traversal order is established which is the blue line, and
          in the zoom-in, the vertex after the blue line has its normal flipped
          because its orientation is incorrect wrt to the previous normal.
        </p>

        <p>
          To begin traversal, we choose the point with the largest{" "}
          <MathJax inline={true}>{"\\(x\\)"}</MathJax> component as our start
          vertex, ensure its normal is facing in the same direction as{" "}
          <MathJax inline={true}>
            {"\\(\\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix}\\)"}
          </MathJax>
          :
          <MathJax inline={true}>
            {
              "\\begin{equation*} \\vec{v} \\cdot \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix} > 0 \\end{equation*}"
            }
          </MathJax>{" "}
          and if not, we take{" "}
          <MathJax inline={true}>{"\\(\\vec{v} \\cdot -1\\)"}</MathJax>. We then
          traverse the mst with our normal orienting method until every normal
          points away from the interior of the mesh.
        </p>
      </div>
    ),
  },
  {
    id: "Signed Distance Function",
    content: (
      <div>
        <h2>Signed Distance Function</h2>
        <p>
          A signed distance function{" "}
          <MathJax inline={true}>{"\\(f(p)\\)"}</MathJax> gives us two pieces of
          information:
        </p>
        <ul>
          <li>
            A point is inside the mesh if{" "}
            <MathJax inline={true}>{"\\(f(p) < 0\\)"}</MathJax>, outside the
            mesh if <MathJax inline={true}>{"\\(f(p) > 0\\)"}</MathJax>, and on
            the mesh if <MathJax inline={true}>{"\\(f(p) = 0\\)"}</MathJax>.
          </li>
          <li>
            <MathJax inline={true}>{"\\(\\lvert f(p) \\rvert\\)"}</MathJax>{" "}
            gives us the distance a point is the the surface.
          </li>
        </ul>
        <p>
          Evaluating the sdf for our mesh at point{" "}
          <MathJax inline={true}>{"\\(p\\)"}</MathJax> is then done by choosing
          a point from our sample, <MathJax inline={true}>{"\\(s\\)"}</MathJax>,
          that is closest to <MathJax inline={true}>{"\\(p\\)"}</MathJax>
          and obtaining the distance from{" "}
          <MathJax inline={true}>{"\\(p\\)"}</MathJax> to the tangent plane,
          <MathJax inline={true}>{"\\(s.TP\\)"}</MathJax>
          of <MathJax inline={true}>{"\\(s\\)"}</MathJax>. We multiply the
          result by:
          <MathJax inline={true}>
            {
              "\\begin{equation*} \\text{sign}\\{\\text{proj}_{s.TP}(p) \\cdot s.N\\} \\end{equation*}"
            }
          </MathJax>
          (<MathJax inline={true}>{"\\(+1\\)"}</MathJax> if the point is
          outside, <MathJax inline={true}>{"\\(-1\\)"}</MathJax> if inside,{" "}
          <MathJax inline={true}>{"\\(0\\)"}</MathJax> otherwise.)
        </p>
      </div>
    ),
  },
  {
    id: "Marching Cubes",
    content: (
      <div>
        <h2>Marching Cubes</h2>
        <p>
          The marching cubes algorithm is based on using a lookup table to
          determine the mesh triangles of a given finite element, in this case,
          we discretize the space into cubic subdivisions. We then use our
          signed distance function to determine the triangles that the given
          finite element has.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/marchingcubes.png")}
            alt="Marching Cubes"
            height="330"
            width="700"
          />
        </ImageContainer>
        <p>
          We intersect our cube with our mesh and evaluate the sdf on the
          cube&apos;s vertices. We mark the vertices that are inside the mesh as
          orange and we match them with the triangles found in the image above.
          After running this on all cubes that intersect our mesh, we obtain the
          final mesh.
        </p>
      </div>
    ),
  },
  {
    id: "Poisson Reconstruction",
    content: (
      <div>
        <h2>Poisson Reconstruction</h2>
        <ImageContainer columns={3}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/poisson/poisson6.jpg")}
              alt="poisson6"
              width="2000"
              height="1780"
            />
            <figcaption>Octree Depth 6</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/poisson/poisson8.jpg")}
              alt="poisson8"
              width="2000"
              height="1780"
            />
            <figcaption>Octree Depth 8</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/poisson/poisson10.jpg")}
              alt="poisson10"
              width="2000"
              height="1780"
            />
            <figcaption>Octree Depth 10</figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Solving the Matrix",
    content: (
      <div>
        <h2>Solving the Matrix</h2>
        <ImageContainer columns={2}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/poisson/indicator_box.png")}
              alt="indicator box"
              width="2000"
              height="1780"
            />
            <figcaption>Indicator for Box</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/poisson/indicator_ball.png")}
              alt="indicator ball"
              width="2000"
              height="1780"
            />
            <figcaption>Indicator for Ball</figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Surface Reconstruction</h1>
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
          <Sidebar ids={pageContent.map((article) => article.id)} />
        </MainContainer>
      </PageContainer>
    </div>
  );
}

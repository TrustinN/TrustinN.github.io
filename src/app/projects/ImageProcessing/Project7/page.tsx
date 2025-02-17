"use client";

import path from "path";
import Image from "next/image";
import { ImageContainer } from "@/components/ImageContainer";
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
import { MathJax } from "better-react-mathjax";

const base = "/projects/ImageProcessing/Project7/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Creating the Web",
    content: (
      <div>
        <h2>Creating the Web</h2>
        <p>
          To get a 3d representation of the image, we can break the scene down
          into 5 planes (middle, left, bottom, right, top). To do this, we
          identify a vanishing point along with the corners of the middle plane:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/sjerome/web.png")}
            alt="sjerome web"
            width="1028"
            height="680"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Computing the Planes",
    content: (
      <div>
        <h2>Computing the Planes</h2>
        <p>
          To recover the 2d coordinate points of the planes, we compute all
          intersections of the web rays with the image border lines. A web ray
          would be defined as the ray from the vanishing point to one of the
          corners of the middle plane.
        </p>
        <p>
          We start at one web ray. This ray intersects two lines on the image
          border. Pick an intersection to append to a running list of
          intersections arbitrarily. Cycle to the next ray counter clockwise.
          The next ray will also intersect with two lines on the image border.
          We append the intersects in the order of which one is closer axis
          aligned to the previous intersection.
        </p>
        <p>
          After this, we can combine these intersection points with the points
          in the middle plane to get the 2d points of all the planes:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/sjerome/planes.png")}
            alt="sjerome planes"
            width="760"
            height="580"
          />
        </ImageContainer>
        <p>
          This image contains also the bounding boxes for the homography which
          we compute based on 3d correspondences described in the next section.
        </p>
      </div>
    ),
  },
  {
    id: "3D Correspondences",
    content: (
      <div>
        <h2>3D Correspondences</h2>
        <p>
          To compute the aspect ratios for the homographies, we need to assign
          every vertex of every plane to a 3d point.
        </p>
        <p>
          We start with assuming that the world coordinates for the bottom plane
          all have a $z$ component of 0. Then the 3d point assignments are:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/sjerome/base3d.svg")}
            alt="sjerome base3d points"
            width="300"
            height="210"
          />
        </ImageContainer>
        <p>
          Suppose we now want to calculate the 3d position of the point $p$
          labeled in red. Then we can use the quadrilateral bisection property
          which yields perspective consistent ratios along the length of a
          quadrilateral on iterative diagonal intersections:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/sjerome/ratios.svg")}
            alt="quad ratios"
            width="300"
            height="210"
          />
        </ImageContainer>
        <p>
          To apply this, we first instantiate a horizontal line going through
          $p$. We sort the lines in order from closest to the middle plane to
          furthest along the given axis and apply the ratio property repeatedly
          on the containing quadrilateral until a ratio line is sufficiently
          close to the target line. Now that we have the ratio, if{" "}
          <MathJax inline={true}>{"\\(p\\)"}</MathJax> was within the bound of
          the bottom plane, we set the ratio as{" "}
          <MathJax inline={true}>{"\\(1 - r\\)"}</MathJax>, otherwise, we set
          the ratio to be <MathJax inline={true}>{"\\(1/(1 - r)\\)"}</MathJax>.
          In this example, suppose{" "}
          <MathJax inline={true}>{"\\(r = 1 / 10\\)"}</MathJax>. Then we set{" "}
          <MathJax inline={true}>{"\\(r \\leftarrow 1 - r\\)"}</MathJax> and
          compute p as
          <MathJax inline={true}>
            {
              "\\begin{equation*} r \\cdot [(1, 0, 0) - (0, 0, 0)] + (0, 0, 0) \\end{equation*}"
            }
          </MathJax>
        </p>
        <p>
          Propagating these ratios and repeating the calculations for all other
          planes, we can determine the aspect ratios for the rectified
          homography.
        </p>
      </div>
    ),
  },
  {
    id: "Homographies",
    content: (
      <div>
        <h2>Homographies</h2>
        <p>
          After instantiating the canvases for the homography, we crop each
          portion of the image and perform a homography locally from each plane
          onto their corresponding canvases.
        </p>
        <ImageContainer columns={5}>
          <Image
            src={path.join(mediaBase, "/sjerome/left.png")}
            alt="sjerome left"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/sjerome/bottom.png")}
            alt="sjerome bottom"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/sjerome/right.png")}
            alt="sjerome right"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/sjerome/top.png")}
            alt="sjerome top"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/sjerome/middle.png")}
            alt="sjerome middle"
            loading="lazy"
            width="640"
            height="480"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Texture Map",
    content: (
      <div>
        <h2>Texture Map</h2>
        <p>
          Now that we have the 3d coordinates of each image, we can do a texture
          map onto a plane. This is done by instantiating the plane by
          counter-clockwise oriented points, and setting the origin, u, v
          vectors for each plane:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/sjerome/texture_map.png")}
            alt="sjerome texture map"
            width="940"
            height="690"
          />
          <Image
            src={path.join(mediaBase, "/sjerome/view1.png")}
            alt="sjerome view 1"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/sjerome/view2.png")}
            alt="sjerome view 2"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/sjerome/view3.png")}
            alt="sjerome view 3"
            width="1000"
            height="750"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Various Ratios",
    content: (
      <div>
        <h2>Various Aspect Ratios</h2>
        <p>
          We can perform this on any image with one point perspective, as long
          as we can find a good guess for the 3d coordinates of the bottom
          plane. For this one, I used an $x$ to $y$ ratio of $5$.
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/mainstacks/web.png")}
            alt="mainstacks web"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/planes.png")}
            alt="mainstacks planes"
            width="640"
            height="480"
          />
        </ImageContainer>

        <ImageContainer columns={5}>
          <Image
            src={path.join(mediaBase, "/mainstacks/left.png")}
            alt="mainstacks left"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/bottom.png")}
            alt="mainstacks bottom"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/right.png")}
            alt="mainstacks right"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/top.png")}
            alt="mainstacks top"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/middle.png")}
            alt="mainstacks middle"
            loading="lazy"
            width="640"
            height="480"
          />
        </ImageContainer>

        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/mainstacks/texture_map.png")}
            alt="mainstacks texture map"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/view1.png")}
            alt="mainstacks view 1"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/view2.png")}
            alt="mainstacks view 2"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/mainstacks/view3.png")}
            alt="mainstacks view 3"
            width="1000"
            height="750"
          />
        </ImageContainer>

        <p>Here is another hallway-like mapping:</p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/bookshelves/web.png")}
            alt="bookshelves web"
            width="940"
            height="740"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/planes.png")}
            alt="bookshelves planes"
            width="640"
            height="480"
          />
        </ImageContainer>

        <ImageContainer columns={5}>
          <Image
            src={path.join(mediaBase, "/bookshelves/left.png")}
            alt="bookshelves left"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/bottom.png")}
            alt="bookshelves bottom"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/right.png")}
            alt="bookshelves right"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/top.png")}
            alt="bookshelves top"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/middle.png")}
            alt="bookshelves middle"
            loading="lazy"
            width="640"
            height="480"
          />
        </ImageContainer>

        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/bookshelves/texture_map.png")}
            alt="bookshelves texture map"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/view1.png")}
            alt="bookshelves view 1"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/view2.png")}
            alt="bookshelves view 2"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/bookshelves/view3.png")}
            alt="bookshelves view 3"
            width="1000"
            height="750"
          />
        </ImageContainer>

        <p>
          In this example, we see that the method does not do well when the
          objects in the scene are not planar. The trees and bush are noticeably
          warped/cut off by the transformations
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/bay/web.png")}
            alt="bay web"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bay/planes.png")}
            alt="bay planes"
            width="640"
            height="480"
          />
        </ImageContainer>

        <ImageContainer columns={5}>
          <Image
            src={path.join(mediaBase, "/bay/left.png")}
            alt="bay left"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bay/bottom.png")}
            alt="bay bottom"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bay/right.png")}
            alt="bay right"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bay/top.png")}
            alt="bay top"
            loading="lazy"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/bay/middle.png")}
            alt="bay middle"
            loading="lazy"
            width="640"
            height="480"
          />
        </ImageContainer>

        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/bay/texture_map.png")}
            alt="bay texture map"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/bay/view1.png")}
            alt="bay view 1"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/bay/view2.png")}
            alt="bay view 2"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/bay/view3.png")}
            alt="bay view 3"
            width="1000"
            height="750"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Extending to 2-Point",
    content: (
      <div>
        <h2>Extending to 2-Point Perspective</h2>
        <p>
          In the previous experiments, we had the vanishing point close to the
          center of the imaging plane. But when there is enough of a shift of
          the vanishing point, we start to see two specific vanishing points
          which form a vanishing line.
        </p>
        <p>
          We can think of this as two separate one point perspectives to build
          the web:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/monument/monumentweb1.png")}
            height="1000"
            width="2500"
            alt="monument web 1"
          />
          <Image
            src={path.join(mediaBase, "/monument/monumentweb2.png")}
            alt="monument web 2"
            height="1000"
            width="2500"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Calculating the Planes and 3D Points",
    content: (
      <div>
        <h2>Calculating the Planes and 3D Coordinates</h2>
        <p>
          Now that we have our web, we can use the vanishing points to project
          the inner rectangles in each web outwards. To specifically determine
          how much we should project each plane outwards, we determine the
          maximum possible projection such that one of the corners of the planes
          still lies within the image borders. Although it is possible to choose
          the minimum as a metric, it can cause the planes to be calculated
          incorrectly when the perspective lines are close. Choosing the maximum
          also helps with stability.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/monument/planes.png")}
            alt="monument planes"
            width="640"
            height="480"
          />
        </ImageContainer>
        <p>
          To compute the 3d coordinates of each point, we first establish the
          ratios of x, y, z such that max(x, y, z) = 1. Then we apply the
          coordinate estimates to each vertex in the top and bottom planes shown
          below:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/monument/baseplanes.png")}
            alt="monument base planes"
            width="1000"
            height="650"
          />
        </ImageContainer>
        <p>
          Now that we have the initial coordinates, we can use the same trick
          with quadrilateral ratios in the previous section to compute the ratio
          in which we expanded outwards by, and propagate the coordinate
          estimates across the vertices.
        </p>
      </div>
    ),
  },
  {
    id: "Mosaics and Final Result",
    content: (
      <div>
        <h2>Mosaics and Final Result</h2>
        <p>
          Computing the homography is exactly the same as in the one point
          perspective images, and at the end, we get two mosaics
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/monument/leftmap.png")}
            alt="monument left map"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/monument/rightmap.png")}
            alt="monument right map"
            width="640"
            height="480"
          />
        </ImageContainer>
        <p>
          We remove the one plane from each figure and combine the textures into
          a 3d representation:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/monument/texturemap.png")}
            alt="monument texture map"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/monument/view1.png")}
            alt="monument view 1"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/monument/view2.png")}
            alt="monument view 2"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/monument/view3.png")}
            alt="monument view 3"
            width="1000"
            height="750"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Additional Results",
    content: (
      <div>
        <h2>Additional Results</h2>
        <p>
          Here is another 2-point perspective representation with a photo of Doe
          Library instead:
        </p>
        <h3>Web</h3>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/doe/doeweb1.png")}
            alt="doe web 1"
            width="2400"
            height="770"
          />
          <Image
            src={path.join(mediaBase, "/doe/doeweb2.png")}
            alt="doe web 2"
            width="2400"
            height="770"
          />
        </ImageContainer>
        <h3>Planes</h3>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/doe/planes.png")}
            alt="doe planes"
            width="640"
            height="480"
          />
        </ImageContainer>
        <h3>Left, Right Maps</h3>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/doe/leftmap.png")}
            alt="doe left map"
            width="640"
            height="480"
          />
          <Image
            src={path.join(mediaBase, "/doe/rightmap.png")}
            alt="doe right map"
            width="640"
            height="480"
          />
        </ImageContainer>
        <h3>Texture Maps</h3>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/doe/texturemap.png")}
            alt="doe texture map"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/doe/view1.png")}
            alt="doe view 1"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/doe/view2.png")}
            alt="doe view 2"
            width="1000"
            height="750"
          />
          <Image
            src={path.join(mediaBase, "/doe/view3.png")}
            alt="doe view 3"
            width="1000"
            height="750"
          />
        </ImageContainer>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Project 7: Tour into the Picture</h1>
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

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
import { MathJax } from "better-react-mathjax";

const base = "/projects/SpatialIndexing/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "What are They?",
    content: (
      <div>
        <h2>What are They?</h2>
        <p>
          Indexing often describes methods of storing and organizing large
          amounts of data. In this case, spatial indexing is for the storage and
          querying of large amounts of spatial data, typically used in path
          planning and navigation. For example, map applications can store
          registered location data to provide the user with nearby
          attractions/restaurants they may want to visit.
        </p>
        <p>
          Spatial trees can be of different types, some are balanced trees
          (R-Trees) where they try to minimize tree depth. Others are adaptive
          and bound the number of children per tree node (Quad-trees, Octrees,
          ...).
        </p>
      </div>
    ),
  },
  {
    id: "R-Trees",
    content: (
      <div>
        <h2>R-Trees</h2>
        <p>
          For my project, I chose to implement an RTree compared to other
          spatial indexing methods such as K-D trees/Octrees for its ability to
          store not only points but higher-dimensional objects.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/rtree-2d-insert.png")}
            alt="rtree-2d-insert"
            width="1150"
            height="850"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "IndexRecords and IndexPointers",
    content: (
      <div>
        <h2>IndexRecords and IndexPointers</h2>
        <p>
          The tree stores objects called index records and index pointers, both
          of which are a type of rtree entry. This means they contain
          information on their bounding box. The only difference is that index
          pointers are stored in the non leaf nodes while index records are
          stored in the leaf nodes.
        </p>
        <p>
          Each index record is of the form:{" "}
          <MathJax>
            {
              "\\begin{equation*} (\\text{id}, \\text{bounding box}) \\end{equation*}"
            }
          </MathJax>{" "}
          where id is the id of the item we want to store and the bounding box
          is an array of tuples:{" "}
          <MathJax>
            {
              "\\begin{equation*} [(a_{1}, b_{1}), \\ldots, (a_{n}, b_{n})] \\end{equation*}"
            }
          </MathJax>{" "}
          where in the <MathJax inline={true}>{"\\(i\\)"}</MathJax>-th
          dimension, the point location{" "}
          <MathJax inline={true}>{"\\(p_{i}\\)"}</MathJax> on the object is such
          that:
          <MathJax>
            {
              "\\begin{equation*} a_{i} \\leq p_{i} \\leq b_{i} \\end{equation*}"
            }
          </MathJax>
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/rtree-structure.png")}
            alt="rtree-structure"
            loading="lazy"
            width="800"
            height="320"
          />
        </ImageContainer>
        <p>
          An index pointer also has bounding box and also points to either a
          leaf node or a branch node
        </p>
      </div>
    ),
  },
  {
    id: "Leaf/Branch Nodes",
    content: (
      <div>
        <h2>Leaf Nodes and Branch Nodes</h2>
        <p>
          These are the nodes that store the index records and index pointers of
          the tree. Leaf nodes store an array of index records while branch
          nodes store an array of index pointers.
        </p>
      </div>
    ),
  },
  {
    id: "R-Tree Insert",
    content: (
      <div>
        <h2>The Insert Algorithm</h2>
        <p>
          In growing the tree, we want to ensure that there is as little bound
          overlap between bounds as possible between neighboring nodes. This
          way, searching for a node becomes easier if there is less bound
          overlap.
        </p>
        <h3>Choose Leaf</h3>
        <p>
          We first explore down the tree finding the best node to insert into at
          each level. This is determined by the
          <code> ChooseLeaf </code> function, which picks a leaf that results in
          the least bound expansion if we were to insert our index record.
        </p>
        <p>
          Once we have found our leaf node, we insert the index record, and
          propagate the change upwards, updating the tree bounds of the leaf
          node, branch nodes, and index pointers that we traversed.
        </p>
        <h3>Splitting the Tree</h3>
        <p>
          If insertion into the leaf node results in the number of children
          exceeding a chosen max size, we split the node into two leaf nodes.
          The children are redistributed among the leaf nodes and again, changes
          are propagated upwards. This propagation can cause subsequent splits
          to happen.
        </p>
        <p>
          If the root node splits, we create a new root and set the split nodes
          as the new root&apos;s children
        </p>
      </div>
    ),
  },
  {
    id: "Splitting Nodes",
    content: (
      <div>
        <h2>Splitting the Node</h2>
        <p>
          Finding a good split is difficult to accomplish efficintly, as the new
          nodes must share as little bound overlap as possible. There are two
          methods of splits that provide similar results. These are the Linear
          and Quadratic splits, which involve picking two seeds/index record
          that we start off with in our split node. We then determine the
          subsequent index record allocation by some heuristic.
        </p>
      </div>
    ),
  },
  {
    id: "Search Algorithm",
    content: (
      <div>
        <h2>Search Algorithm</h2>
        <p>
          The search algorithm is what makes the R-Tree useful. The idea is to
          start with a small radius that we search around and continually grow
          this radius until we find the node we are looking for. In practice, we
          use a priority queue to store the index pointer/index record that is
          closest to the query. At each pop, we can either dump the contents of
          the index pointer into the priority queue or if we see an index
          record, that is the closest value to the query.
        </p>
      </div>
    ),
  },
  {
    id: "Delete Method",
    content: (
      <div>
        <h2>Delete Method</h2>
        <p>
          The delete method is similar to the search method, but we delete a
          node once it has been found and propagate any bound changes up. If a
          node is underfull, we remove the node from the tree. After the delete
          operation, we reinsert all of its children.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/rtree-2d-delete.png")}
            alt="rtree-2d-delete"
            loading="lazy"
            width="1000"
            height="800"
          />
        </ImageContainer>
        <p>
          This means that the tree must be able to handle insertion of index
          pointers also. It is recommended that the minimum number of children
          is <MathJax inline={true}>{"\\(40\\%\\)"}</MathJax> of the max number
          of children of a tree node.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/rtree-3d-delete.png")}
            alt="rtree-3d-delete"
            loading="lazy"
            width="1128"
            height="920"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "R* Trees",
    content: (
      <div>
        <h2>R*-Trees</h2>
        <p>
          R* Trees are very similar to R-Trees but considers two modifications.
          One problem with the R-Tree is once we insert, we are stuck with
          having to work around the bounds calculated from previous insertions.
          R* Trees solve this with an overflow method.
        </p>
        <p>
          The second modification is in the splitting process. Rather than
          picking two seeds, we sort the objects along every dimension and
          choosing the split along the dimension that results in the least
          overlap.
        </p>
        <p>
          There are also a couple smaller modifcations which try to ensure that
          the rectangular bounds of the tree nodes are as square as possible
          which results in a cleaner packing of bounds.
        </p>
      </div>
    ),
  },
  {
    id: "Overflow Treatment",
    content: (
      <div>
        <h2>Overflow Treatment</h2>
        <p>
          If there are too many index records/index pointers in a leaf
          node/branch node after an insertion, we first attempt to reinsert all
          children back into the tree. This can cause some subsequent splitting,
          so we assert that this overflow can only happen once per level of the
          tree (prevent loops). If overflow has occurred, we do the usual tree
          split and propagation upwards.
        </p>
      </div>
    ),
  },
  {
    id: "Conclusion",
    content: (
      <div>
        <h2>Conclusion</h2>
        <p>
          R*-Trees although not optimal in terms of keeping bound overlap
          minimal is known for being efficient enough in practice. If the
          distribution of the data is known before hand, there are methods to
          construct an R*-Tree through sorting and loading the data all in at
          once.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Spatial Indexing</h1>
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

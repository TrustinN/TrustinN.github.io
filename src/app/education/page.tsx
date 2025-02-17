"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Banner } from "@/components/Banner";
import { Sidebar } from "@/components/Sidebar";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import type { articleElem } from "@/components/ContentContainer";

type jsonEntry = { name: string; url: string };
type course = { title: string; desc: string; links?: jsonEntry[] };
type schoolyear = {
  semester: string;
  courses: course[];
}[];

const filterByName = (pattern: string, entries: jsonEntry[]) => {
  return entries.filter((entry: jsonEntry) => entry.name.includes(pattern));
};

const TableHeader = () => {
  return (
    <>
      <tr className="p-2 border border-black border-solid border-collapse m-8">
        <th className="p-2 border border-black border-solid border-collapse m-8">
          &nbsp;
        </th>
        <th className="p-2 border border-black border-solid border-collapse m-8">
          Course
        </th>
        <th className="p-2 border border-black border-solid border-collapse m-8">
          Description
        </th>
        <th className="p-2 border border-black border-solid border-collapse m-8">
          Resources
        </th>
      </tr>
    </>
  );
};

const TableData = ({
  data,
}: {
  data: { semester: string; courses: course[] };
}) => {
  if (!data) {
    return <></>;
  }
  return data.courses.map((course: course, index: number) => (
    <tr
      className="p-2 border border-black border-solid border-collapse m-8"
      key={index}
    >
      <td className="p-2 border border-black border-solid border-collapse m-8">
        {course.title}
      </td>
      <td className="p-2 border border-black border-solid border-collapse m-8">
        {course.desc}
      </td>
      {course.links && course.links.length != 0 ? (
        <td className="p-2 border border-black border-solid border-collapse m-8">
          <aside>
            <details>
              <summary>Resources</summary>
              {course.links.map((data: jsonEntry) => (
                <div key={data.name}>
                  <Link href={data.url}>{data.name}</Link>
                </div>
              ))}
            </details>
          </aside>
        </td>
      ) : (
        <tr className="p-2 border border-black border-solid border-collapse m-8"></tr>
      )}
    </tr>
  ));
};

const DataHeader = ({
  name,
  data,
}: {
  name: string;
  data: { semester: string; courses: course[] };
}) => {
  return (
    <>
      {data ? (
        <tr className="p-2 border border-black border-solid border-collapse m-8">
          <td
            className="p-2 border border-black border-solid border-collapse m-8"
            rowSpan={data.courses.length + 1}
          >
            {name}
          </td>
        </tr>
      ) : (
        <></>
      )}
    </>
  );
};

const CourseTable = ({ entries }: { entries: schoolyear }) => {
  const sem1 = entries[0];
  const sem2 = entries[1];
  return (
    <div>
      <table className="p-2 border border-black border-solid border-collapse m-8">
        <TableHeader />
        <DataHeader name="1st Semester" data={sem1} />
        <TableData data={sem1} />
        <DataHeader name="2nd Semester" data={sem2} />
        <TableData data={sem2} />
      </table>
    </div>
  );
};

export default function Home() {
  const [pdfList, setPdfList] = useState<jsonEntry[]>([]);
  useEffect(() => {
    // Fetch a file from the public directory (e.g., a JSON file)
    fetch("/education/pdfList.json") // The path starts from the public folder
      .then((response) => response.json())
      .then((data) => {
        setPdfList(data);
      });
  }, []);

  const courses: schoolyear[] = [
    [
      {
        semester: "1st",
        courses: [
          {
            title: "FRENCH 43A",
            desc: "Aspects of French Culture",
          },
          {
            title: "INTEGBI 43",
            desc: "What Lives Inside Us? Microbiomes and Symbiosis",
          },
          {
            title: "MATH 54",
            desc: "Linear Algebra and Differential Equations",
            links: filterByName("Math54", pdfList),
          },
          {
            title: "MATH 55",
            desc: "Discrete Mathematics",
            links: filterByName("Math55", pdfList),
          },
        ],
      },
      {
        semester: "2nd",
        courses: [
          {
            title: "GWS 100AC",
            desc: "Women in American Culture",
          },
          {
            title: "MATH 110",
            desc: "Linear Algebra",
            links: filterByName("Math110", pdfList),
          },
          {
            title: "MATH 113",
            desc: "Introduction to Abstract Algebra",
            links: filterByName("Math113", pdfList),
          },
          {
            title: "MATH 124",
            desc: "Programming for Mathematical Applications",
            links: filterByName("Math124", pdfList),
          },
        ],
      },
    ],
    [
      {
        semester: "1st",
        courses: [
          {
            title: "MATH 104",
            desc: "Introduction to Real Analysis",
            links: filterByName("Math104", pdfList),
          },
          {
            title: "MATH 143",
            desc: "Elementary Algebraic Geometry",
            links: filterByName("Math143", pdfList),
          },
          {
            title: "MATH 172",
            desc: "Combinatorics",
            links: filterByName("Math172", pdfList),
          },
          {
            title: "MATH 250A",
            desc: "Groups, Rings, and Fields",
            links: filterByName("Math250a", pdfList),
          },
          {
            title: "ELENG 198",
            desc: "Micromouse",
          },
        ],
      },
      {
        semester: "2nd",
        courses: [
          {
            title: "CS 61A",
            desc: "The Structure and Interpretation of Computer Programs",
          },
          {
            title: "CS 61B",
            desc: "Data Structures",
          },
          {
            title: "MATH 185",
            desc: "Complex Analysis",
            links: filterByName("Math185", pdfList),
          },
          {
            title: "STAT 134",
            desc: "Concepts of Probability",
            links: filterByName("Stat134", pdfList),
          },
          {
            title: "ELENG 198",
            desc: "PCB Engineering",
          },
        ],
      },
    ],
    [
      {
        semester: "1st",
        courses: [
          {
            title: "CS 61C",
            desc: "Great Ideas of Computer Architecture (Machine Structures)",
          },
          {
            title: "CS 170",
            desc: "Efficient Algorithms and Intractable Problems",
            links: filterByName("CS170", pdfList),
          },
          {
            title: "CS 180",
            desc: "Intro to Computer Vision and Computational Photography",
          },
          {
            title: "MATH 128A",
            desc: "Numerical Analysis",
            links: filterByName("Math128a", pdfList),
          },
          {
            title: "CS 189",
            desc: "Introduction to Machine Learning",
            links: filterByName("CS189", pdfList),
          },
        ],
      },
    ],
  ];

  const pageContent: articleElem[] = [
    {
      id: "First Year",
      content: (
        <div>
          <h2>1st Year</h2>
          <p>
            Class Ranking: Abstract Algebra, Integrative Biology, Programming
            for Mathematical Applications
          </p>
        </div>
      ),
    },
    {
      id: "Second Year",
      content: (
        <div>
          <h2>2nd Year</h2>
          <p>
            Class Ranking: Algebraic Geometry, Combinatorics, Groups, Rings,
            Fields
          </p>
        </div>
      ),
    },
    {
      id: "Third Year",
      content: (
        <div>
          <h2>3rd Year</h2>
          <p>
            Class Ranking: Computational Photography/Vision, Algorithms,
            Computer Architecture
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Banner>
        <h1>Education</h1>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article, index) => (
              <Section key={article.id}>
                <Article id={article.id}>
                  {" "}
                  {article.content}
                  <CourseTable entries={courses[index]}></CourseTable>
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

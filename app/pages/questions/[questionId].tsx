import Layout from "app/core/layouts/Layout";
import deleteQuestion from "app/questions/mutations/deleteQuestion";
import getQuestion from "app/questions/queries/getQuestion";
import { BlitzPage, Head, Link, Routes, useMutation, useParam, useQuery, useRouter } from "blitz";
import { Suspense } from "react";

export const Question = () => {
  const router = useRouter();
  const questionId = useParam("questionId", "number");
  const [deleteQuestionMutation] = useMutation(deleteQuestion);
  const [question] = useQuery(getQuestion, { id: questionId });

  return (
    <>
      <Head>
        <title>Question {question.id}</title>
      </Head>

      <div>
        <h1>{question.text}</h1>

        <ul>
          {question.choices.map((choice) => (
            <li key={choice.id}>
              {choice.text} - {choice.votes} votes
            </li>
          ))}
        </ul>

        <Link href={Routes.EditQuestionPage({ questionId: question.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteQuestionMutation({ id: question.id });
              router.push(Routes.QuestionsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowQuestionPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.QuestionsPage()}>
          <a>Questions</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Question />
      </Suspense>
    </div>
  );
};

ShowQuestionPage.authenticate = true;
ShowQuestionPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowQuestionPage;

import User from "../components/User";

export default function UserList({ users }) {
  return (
    <div className="users">
      {users.map((user) => (
        <User key={user.id} user={user} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(`http://jsonplaceholder.typicode.com/users`);

  const data = await res.json();

  return {
    props: {
      users: data,
    },
  };
}

export default function User({ user }) {
  return (
    <div className="User">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

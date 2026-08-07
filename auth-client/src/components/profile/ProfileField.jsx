function ProfileField({ label, value }) {
  return (
    <div>
      <strong>{label}</strong>
      <p>{value}</p>
    </div>
  )
}

export default ProfileField
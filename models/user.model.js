class User {
  constructor(data = {}) {
    // Basic Auth Fields (Required)
    this.id = data.id || null;
    this.name = data.name || null;
    this.email = data.email || null;
    this.password = data.password || null;
    this.roleId = data.roleId || 2; // Default 2 = User, 1 = Admin 
    this.MemberCode = data.MemberCode || null;
    this.FathersName = data.FathersName || null;
    this.MothersName = data.MothersName || null;
    this.DateOfBirth = data.DateOfBirth || null;
    this.GenderID = data.GenderID || null;
    this.BloodGroupID = data.BloodGroupID || null;
    this.ReligionID = data.ReligionID || null;
    this.MobileNo = data.MobileNo || null;
    this.Picture = data.Picture || 'default-avatar.png'; // Default Image
    this.Status = data.Status || 'Pending';
    this.PassportNo = data.PassportNo || null;
    this.Organization = data.Organization || null;
    this.PresentAddress = data.PresentAddress || null;
    
    // System Fields
    this.Timestamp = data.Timestamp || new Date();
  }
}

module.exports = User;
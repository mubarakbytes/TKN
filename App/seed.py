from werkzeug.security import generate_password_hash
from db.models import db, User
from datetime import datetime
from barnaamij.app import app




with app.app_context():
    # db.create_all()
    # hashed_password = generate_password_hash('mr.mubra123')
    # newSubarAddmin = SuperAdmin(
    #     username='mr.mubra',
    #     password=hashed_password
    # )
    # db.session.add(newSubarAddmin)
    # db.session.commit()

    pwd = generate_password_hash('mubaarak')
    newUser = User(
        full_name='mubaarak',
        username='mubra',
        password=pwd,
        email="mubra@gmail.com",
        phone="+252613781536",
        address="Kaxda, mogadishu, somalia",

        profile_image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTAUPUG0r--EDZzf-f9Afj_Jp7N96yIGsWPgCYIkrAS1rCJHIcdm_RCq_me44bJc0dvvY&usqp=CAU",

    )
    db.session.add(newUser)
    db.session.commit()

    print("User added successfully.")
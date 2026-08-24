from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.models import Policy, User
from app.schemas.db_schemas import PolicyCreate, PolicyResponse, PolicyUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[PolicyResponse])
def list_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Policy).filter(Policy.owner_id == current_user.id).all()

@router.post("", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def create_policy(
    policy_in: PolicyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    policy = Policy(
        owner_id=current_user.id,
        scope=policy_in.scope,
        data_type=policy_in.data_type,
        sensitivity=policy_in.sensitivity,
        action=policy_in.action,
        enabled=policy_in.enabled
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy

@router.get("/{id}", response_model=PolicyResponse)
def get_policy(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    policy = db.query(Policy).filter(Policy.id == id, Policy.owner_id == current_user.id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

@router.put("/{id}", response_model=PolicyResponse)
def update_policy(
    id: str,
    policy_in: PolicyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    policy = db.query(Policy).filter(Policy.id == id, Policy.owner_id == current_user.id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
        
    for field, value in policy_in.model_dump(exclude_unset=True).items():
        setattr(policy, field, value)
        
    db.commit()
    db.refresh(policy)
    return policy

@router.delete("/{id}")
def delete_policy(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    policy = db.query(Policy).filter(Policy.id == id, Policy.owner_id == current_user.id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
        
    db.delete(policy)
    db.commit()
    return {"message": "Policy deleted successfully"}
